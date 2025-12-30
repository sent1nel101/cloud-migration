# Deployment Guide

Instructions for deploying CareerAI to production.

## Option 1: Vercel (Recommended)

Vercel is built by the creators of Next.js and offers the best experience.

### Prerequisites
- GitHub account with repo pushed
- Vercel account (free: vercel.com)

### Steps

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/career-ai.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit https://vercel.com/new
   - Select "Import Git Repository"
   - Find your `career-ai` repo
   - Click "Import"

3. **Configure Environment Variables**
   - Go to Settings → Environment Variables
   - Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site is live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

### Vercel Advantages
- Automatic deployments on git push
- Built-in analytics
- Edge caching
- Serverless functions included
- Free tier covers MVP

## Option 2: AWS

### Prerequisites
- AWS account
- Familiarity with AWS services

### Using AWS Amplify (Simplest)

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Deploy with Amplify**
   - Go to AWS Amplify Console
   - Connect your GitHub repo
   - Select branch to deploy
   - Add environment variables
   - Deploy

### Using EC2 (More Control)

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.small minimum
   - Security group: Allow ports 80, 443

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance.com
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Clone your repo
   git clone your-repo-url
   cd amp-migration
   npm install
   ```

3. **Build and Start**
   ```bash
   npm run build
   pm2 start npm --name "career-ai" -- start
   pm2 save
   ```

4. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Option 3: Docker + Heroku

### Prerequisites
- Heroku account
- Docker installed locally

### Steps

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   
   # Create app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set ANTHROPIC_API_KEY=your_key
   
   # Deploy
   git push heroku main
   ```

## Option 4: DigitalOcean App Platform

1. **Push to GitHub**
2. Visit https://cloud.digitalocean.com/apps
3. Click "Create App"
4. Select your GitHub repo
5. Configure environment variables
6. Click "Deploy"

## Pre-Deployment Checklist

- [x] All code committed to git
- [ ] `.env.local` is NOT in git (check .gitignore)
- [ ] API keys added to deployment environment
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors: `npm run lint`
- [ ] Tested with mock data
- [ ] Tested with real AI API (if integrated)
- [ ] README updated with production URL
- [ ] Error handling implemented
- [ ] Logging configured

## Environment Variables

Required for production:
```
ANTHROPIC_API_KEY=sk-ant-xxx  (or OPENAI_API_KEY)
NODE_ENV=production
```

Optional:
```
ANALYTICS_ID=for tracking
SENTRY_DSN=for error monitoring
```

## Monitoring & Logging

### Vercel
- Built-in analytics at vercel.com/dashboard
- Real-time logs available
- Error tracking included

### Other Platforms
Consider adding:
```bash
npm install sentry-nextjs  # Error tracking
npm install pino  # Logging
```

Add to `app/api/roadmap/route.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // ... generate roadmap
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

## Performance Optimization

### For Production
1. Enable caching headers
2. Optimize images (if any)
3. Minify CSS/JS (automatic with Next.js)
4. Use CDN (included with Vercel)
5. Database connection pooling (if applicable)

### Next.js Optimizations
```bash
# Already configured in next.config.js
# - Compression
# - Tree shaking
# - Code splitting
```

## Rollback Procedures

### Vercel
1. Go to Deployments
2. Click the deployment to rollback to
3. Click "Promote to Production"

### Git-based
```bash
git revert <commit-hash>
git push origin main
# Redeployment happens automatically
```

## Cost Estimates (Monthly)

### Vercel
- Free tier: $0 (includes serverless)
- Pro tier: $20/month
- API costs: ~$10-20 (depending on traffic)
- **Total for MVP**: $0-20/month

### AWS
- EC2 t3.small: ~$15/month
- Data transfer: ~$1-5/month
- **Total for MVP**: $15-25/month

### DigitalOcean
- Droplet: $4-5/month
- App Platform: Free with basic plan
- **Total for MVP**: $4-5/month

### Heroku
- Eco dyno: $5-50/month
- Varies by usage
- **Total for MVP**: $5-20/month

## Domain Setup

1. **Buy Domain**
   - Namecheap, GoDaddy, Google Domains

2. **Point to Deployment**
   - Update DNS settings
   - Add CNAME record pointing to deployment

3. **Enable SSL/HTTPS**
   - Most platforms do this automatically
   - Vercel: Automatic
   - AWS: Use Certificate Manager
   - Self-hosted: Use Let's Encrypt

## Scaling for Growth

### When to Upgrade
- Vercel: Automatic (scales serverless)
- EC2: Upgrade instance size
- Database: Add replication/clustering
- API costs: Implement caching

### Caching Strategy
- Cache roadmap results (5 min)
- Cache skill databases
- Use Vercel's built-in cache

## Troubleshooting

**Deployment fails**
- Check build logs
- Verify all dependencies installed
- Check Node.js version

**High costs**
- Check API usage
- Implement caching
- Optimize prompts

**Slow performance**
- Check database queries
- Enable caching
- Use CDN (Vercel does this)

## Support

- Vercel support: https://vercel.com/support
- AWS support: https://aws.amazon.com/support/
- DigitalOcean: https://www.digitalocean.com/help/
- Next.js docs: https://nextjs.org/docs
