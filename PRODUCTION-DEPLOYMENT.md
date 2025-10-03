# CarRental Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the CarRental application in a production environment with enterprise-grade security, performance, and monitoring capabilities.

## Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04 LTS or CentOS 8+ (recommended)
- **CPU**: 4+ cores
- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 100GB+ SSD
- **Network**: Static IP with proper DNS configuration

### Software Dependencies
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
- SSL certificates (Let's Encrypt or commercial)

## Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/carental.git
cd carental
cp .env.production .env
```

### 2. Configure Environment Variables
Edit `.env` file with your production values:
```bash
# Critical - Must be changed
DB_PASSWORD=your_secure_db_password_here
JWT_SECRET=your_jwt_secret_256_bit_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_256_bit_key_here
SESSION_SECRET=your_session_secret_256_bit_key_here
ADMIN_PASSWORD=your_secure_admin_password_here
REDIS_PASSWORD=your_secure_redis_password_here

# Domain configuration
DOMAIN=your-domain.com
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

### 3. SSL Certificate Setup
```bash
# Create SSL directory
mkdir -p docker/nginx/ssl

# For Let's Encrypt (recommended)
certbot certonly --standalone -d your-domain.com
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem docker/nginx/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem docker/nginx/ssl/private.key

# Or place your commercial certificates
cp your-cert.pem docker/nginx/ssl/cert.pem
cp your-private-key.pem docker/nginx/ssl/private.key
```

### 4. Deploy Application
```bash
# Build and start production services
npm run prod

# Start with monitoring (optional)
npm run prod:monitoring
```

### 5. Verify Deployment
```bash
# Check application health
npm run health

# View logs
npm run prod:logs

# Check all services are running
docker-compose -f docker-compose.prod.yml ps
```

## Detailed Configuration

### Database Configuration

#### PostgreSQL Optimization
The production setup includes optimized PostgreSQL configuration:
- **Connection pooling**: 200 max connections
- **Memory tuning**: 256MB shared buffers, 1GB effective cache
- **Performance monitoring**: pg_stat_statements enabled
- **Security**: SCRAM-SHA-256 authentication

#### Database Initialization
```bash
# Initialize database with schema
docker-compose -f docker-compose.prod.yml exec postgres psql -U carental_user -d carental_prod -f /docker-entrypoint-initdb.d/01-schema.sql
```

### Redis Configuration
- **Persistence**: AOF enabled for data durability
- **Security**: Password authentication required
- **Memory**: 256MB limit with LRU eviction

### Security Configuration

#### SSL/TLS
- **Protocols**: TLS 1.2 and 1.3 only
- **Ciphers**: Modern cipher suites
- **HSTS**: Enabled with 1-year max-age
- **Certificate**: Auto-renewal recommended

#### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled

#### Rate Limiting
- **API endpoints**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per minute
- **Connection limits**: 10 per IP

### Monitoring and Observability

#### Prometheus Metrics
Access metrics at: `https://your-domain.com/metrics`
- Application performance metrics
- Database connection stats
- Redis operation metrics
- System resource usage

#### Grafana Dashboard
Access dashboard at: `http://your-domain.com:3001`
- Default credentials: admin / [GRAFANA_PASSWORD]
- Pre-configured CarRental dashboard
- Real-time monitoring and alerting

#### Health Checks
- **Application**: `https://your-domain.com/health`
- **Database**: Automatic health checks every 10s
- **Redis**: Automatic health checks every 10s

## Operational Procedures

### Backup and Recovery

#### Database Backup
```bash
# Create backup
npm run backup:db

# Restore from backup
npm run restore:db < backup_20231201_120000.sql
```

#### Full System Backup
```bash
# Backup volumes
docker run --rm -v carental_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
docker run --rm -v carental_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis_backup.tar.gz /data
```

### Updates and Maintenance

#### Application Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
npm run prod:down
npm run prod

# Verify deployment
npm run health
```

#### Database Maintenance
```bash
# Run VACUUM and ANALYZE
docker-compose -f docker-compose.prod.yml exec postgres psql -U carental_user -d carental_prod -c "VACUUM ANALYZE;"

# Update statistics
docker-compose -f docker-compose.prod.yml exec postgres psql -U carental_user -d carental_prod -c "ANALYZE;"
```

### Scaling and Performance

#### Horizontal Scaling
```bash
# Scale application instances
docker-compose -f docker-compose.prod.yml up --scale app=3 -d
```

#### Performance Tuning
- Monitor CPU and memory usage via Grafana
- Adjust PostgreSQL configuration based on workload
- Optimize Redis memory usage
- Review and adjust rate limits

### Troubleshooting

#### Common Issues

**Application won't start**
```bash
# Check logs
npm run prod:logs

# Check environment variables
docker-compose -f docker-compose.prod.yml config

# Verify SSL certificates
openssl x509 -in docker/nginx/ssl/cert.pem -text -noout
```

**Database connection issues**
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test database connection
docker-compose -f docker-compose.prod.yml exec postgres psql -U carental_user -d carental_prod -c "SELECT 1;"
```

**High memory usage**
```bash
# Check container resource usage
docker stats

# Review application metrics
curl -s http://localhost:9090/metrics | grep memory
```

#### Log Analysis
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs app

# Database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Nginx access logs
docker-compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/access.log
```

## Security Checklist

### Pre-Deployment
- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (256-bit)
- [ ] Configure proper SSL certificates
- [ ] Set up firewall rules
- [ ] Review CORS origins
- [ ] Enable audit logging

### Post-Deployment
- [ ] Verify SSL configuration (A+ rating)
- [ ] Test rate limiting
- [ ] Confirm backup procedures
- [ ] Set up monitoring alerts
- [ ] Review security headers
- [ ] Perform penetration testing

## Performance Optimization

### Database
- Regular VACUUM and ANALYZE operations
- Monitor slow queries via pg_stat_statements
- Optimize indexes based on query patterns
- Consider read replicas for high load

### Application
- Enable compression (gzip)
- Implement caching strategies
- Monitor memory usage and garbage collection
- Use connection pooling

### Infrastructure
- Use CDN for static assets
- Implement load balancing
- Monitor disk I/O and network
- Regular security updates

## Compliance and Governance

### Data Protection
- Implement data encryption at rest
- Configure audit logging
- Set up data retention policies
- Ensure GDPR/CCPA compliance

### Monitoring and Alerting
- Set up alerts for critical metrics
- Monitor security events
- Track application performance
- Implement log aggregation

## Support and Maintenance

### Regular Tasks
- **Daily**: Monitor application health and performance
- **Weekly**: Review security logs and metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Performance review and capacity planning

### Emergency Procedures
- Incident response plan
- Rollback procedures
- Emergency contacts
- Disaster recovery plan

## Additional Resources

- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Nginx Security Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [Prometheus Monitoring Guide](https://prometheus.io/docs/guides/go-application/)

---

For technical support or questions, please contact the development team or create an issue in the project repository.