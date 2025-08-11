#!/bin/bash

echo "🤖 Starting AI Components Auto-Sync..."

# Watch for changes and auto-commit
while true; do
    echo "📡 Monitoring for changes..."
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "🔄 Changes detected! Auto-committing and pushing..."
        
        # Add all changes
        git add .
        
        # Commit with timestamp
        git commit -m "Auto-sync: AI system updates $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Push to GitHub
        git push origin main
        
        echo "✅ Successfully committed and pushed changes!"
        echo "🚀 Vercel will automatically deploy in 1-2 minutes..."
        echo "⏰ Deployment started at: $(date)"
        
        # Wait for deployment
        sleep 120
        
        echo "🎉 Your AI-powered demo should now be live!"
        echo "🌐 Check your Vercel dashboard for deployment status"
    else
        echo "✨ No changes detected. Waiting..."
    fi
    
    # Wait 30 seconds before checking again
    sleep 30
done
