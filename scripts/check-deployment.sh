#!/bin/bash

# CarRental VPS Deployment Health Check Script
# This script checks for common deployment issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}CarRental VPS Deployment Health Check${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check 1: System Resources
echo -e "\n${BLUE}[1] Checking System Resources...${NC}"

TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
AVAILABLE_RAM=$(free -m | awk '/^Mem:/{print $7}')

echo "   Total RAM: ${TOTAL_RAM}MB"
echo "   Available RAM: ${AVAILABLE_RAM}MB"

if [ $TOTAL_RAM -lt 4096 ]; then
    print_warning "RAM < 4GB detected. You may need to reduce memory limits in docker-compose.prod.yml"
elif [ $TOTAL_RAM -lt 8192 ]; then
    print_status 0 "RAM is adequate (4GB+) but 8GB is recommended for production"
else
    print_status 0 "RAM is sufficient (8GB+) for production"
fi

DISK_AVAILABLE=$(df -h / | awk 'NR==2 {print $4}' | sed 's/G//')
echo "   Available Disk: ${DISK_AVAILABLE}GB"

if (( $(echo "$DISK_AVAILABLE < 10" | bc -l) )); then
    print_warning "Low disk space. Consider cleaning up or expanding storage"
else
    print_status 0 "Disk space is sufficient"
fi

# Check 2: Docker Installation
echo -e "\n${BLUE}[2] Checking Docker Installation...${NC}"

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_status 0 "Docker installed: $DOCKER_VERSION"
else
    print_status 1 "Docker is not installed"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(docker-compose --version)
    print_status 0 "Docker Compose installed: $DOCKER_COMPOSE_VERSION"
else
    print_status 1 "Docker Compose is not installed"
    exit 1
fi

# Check 3: Environment File
echo -e "\n${BLUE}[3] Checking Environment Configuration...${NC}"

if [ -f ".env" ]; then
    print_status 0 ".env file exists"
    
    # Check for NODE_OPTIONS (should NOT exist)
    if grep -q "NODE_OPTIONS" .env; then
        print_status 1 "NODE_OPTIONS found in .env (THIS WILL CAUSE ERRORS!)"
        echo -e "   ${RED}Action required: Remove NODE_OPTIONS from .env${NC}"
        echo -e "   ${YELLOW}Run: sed -i '/NODE_OPTIONS/d' .env${NC}"
    else
        print_status 0 "NODE_OPTIONS not found in .env (good)"
    fi
    
    # Check required variables
    REQUIRED_VARS=("DB_PASSWORD" "JWT_SECRET" "JWT_REFRESH_SECRET" "SESSION_SECRET" "ADMIN_PASSWORD" "REDIS_PASSWORD")
    
    for VAR in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${VAR}=" .env; then
            VALUE=$(grep "^${VAR}=" .env | cut -d'=' -f2)
            if [[ "$VALUE" == *"CHANGE_THIS"* ]] || [ -z "$VALUE" ]; then
                print_status 1 "$VAR needs to be changed from default"
            else
                print_status 0 "$VAR is configured"
            fi
        else
            print_status 1 "$VAR is missing"
        fi
    done
    
else
    print_status 1 ".env file not found"
    echo -e "   ${YELLOW}Action required: Copy .env.production to .env and configure it${NC}"
    echo -e "   ${YELLOW}Run: cp .env.production .env && nano .env${NC}"
fi

# Check 4: Docker Containers Status
echo -e "\n${BLUE}[4] Checking Docker Containers...${NC}"

if docker ps -a --format "{{.Names}}" | grep -q "carental"; then
    print_info "CarRental containers found"
    
    # Check each container
    CONTAINERS=("carental-app" "carental-postgres" "carental-redis" "carental-nginx")
    
    for CONTAINER in "${CONTAINERS[@]}"; do
        if docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$"; then
            STATUS=$(docker inspect --format='{{.State.Status}}' $CONTAINER 2>/dev/null || echo "not found")
            if [ "$STATUS" = "running" ]; then
                print_status 0 "$CONTAINER is running"
                
                # Check memory usage for app container
                if [ "$CONTAINER" = "carental-app" ]; then
                    MEM_USAGE=$(docker stats --no-stream --format "{{.MemUsage}}" $CONTAINER 2>/dev/null || echo "N/A")
                    echo "      Memory: $MEM_USAGE"
                fi
            else
                print_status 1 "$CONTAINER is not running (status: $STATUS)"
            fi
        else
            print_status 1 "$CONTAINER is not found"
        fi
    done
else
    print_warning "No CarRental containers found. Run: npm run prod"
fi

# Check 5: Application Health
echo -e "\n${BLUE}[5] Checking Application Health...${NC}"

if command -v curl &> /dev/null; then
    if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_status 0 "Application health check passed"
        HEALTH=$(curl -s http://localhost:5000/api/health)
        echo "      Response: $HEALTH"
    else
        print_status 1 "Application health check failed"
        echo -e "   ${YELLOW}Check logs with: docker-compose -f docker-compose.prod.yml logs app${NC}"
    fi
else
    print_warning "curl not installed, skipping health check"
fi

# Check 6: Port Availability
echo -e "\n${BLUE}[6] Checking Port Availability...${NC}"

PORTS=(80 443 5000 5432 6379)

for PORT in "${PORTS[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":${PORT} "; then
        print_status 0 "Port $PORT is in use (expected)"
    else
        print_warning "Port $PORT is not in use"
    fi
done

# Check 7: Recent Logs for Errors
echo -e "\n${BLUE}[7] Checking Recent Logs for Errors...${NC}"

if docker ps --format "{{.Names}}" | grep -q "carental-app"; then
    ERROR_COUNT=$(docker logs carental-app --since 10m 2>&1 | grep -i "error" | wc -l)
    
    if [ $ERROR_COUNT -eq 0 ]; then
        print_status 0 "No errors in recent logs"
    else
        print_status 1 "Found $ERROR_COUNT errors in recent logs"
        echo -e "   ${YELLOW}Run to see errors: docker logs carental-app --since 10m | grep -i error${NC}"
    fi
    
    # Check for OOM errors
    if docker inspect carental-app | grep -q "OOMKilled.*true"; then
        print_status 1 "Container was killed due to Out Of Memory (OOM)"
        echo -e "   ${RED}Action required: Increase memory limits or optimize application${NC}"
    fi
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Summary & Recommendations${NC}"
echo -e "${BLUE}========================================${NC}\n"

if [ $TOTAL_RAM -lt 4096 ]; then
    echo -e "${YELLOW}• Consider upgrading VPS to 4GB+ RAM${NC}"
    echo -e "  Or reduce memory limits in docker-compose.prod.yml"
fi

if [ -f ".env" ] && grep -q "NODE_OPTIONS" .env; then
    echo -e "${RED}• CRITICAL: Remove NODE_OPTIONS from .env file${NC}"
    echo -e "  Run: ${YELLOW}sed -i '/NODE_OPTIONS/d' .env${NC}"
fi

if [ -f ".env" ]; then
    if grep -q "CHANGE_THIS" .env; then
        echo -e "${RED}• CRITICAL: Update default passwords and secrets in .env${NC}"
    fi
fi

if ! docker ps --format "{{.Names}}" | grep -q "carental-app"; then
    echo -e "${YELLOW}• Start the application with: npm run prod${NC}"
fi

echo -e "\n${GREEN}Health check completed!${NC}\n"

# Save report to file
REPORT_FILE="deployment-check-$(date +%Y%m%d_%H%M%S).txt"
echo "Full report saved to: $REPORT_FILE"

