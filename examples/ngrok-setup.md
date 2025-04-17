# Making Your Zoom Transcript MCP Server Publicly Accessible

AMP requires publicly accessible URLs and cannot connect to `localhost`. To solve this problem, you can use a tool like [ngrok](https://ngrok.com/) to create a temporary public URL for your local server.

## Using ngrok

1. **Install ngrok**
   
   Download and install ngrok from [https://ngrok.com/download](https://ngrok.com/download)

2. **Start your MCP server**
   
   ```bash
   cd zoomcp
   npm run dev
   ```
   
   This starts your server on localhost:3000

3. **Create a public URL with ngrok**
   
   In a separate terminal:
   
   ```bash
   ngrok http 3000
   ```
   
   ngrok will display a public URL that forwards to your local server, like:
   
   ```
   Forwarding https://abc123.ngrok.io -> http://localhost:3000
   ```

4. **Update your AMP configuration**

   Instead of using `http://localhost:3000` as the Command or URL, use the ngrok URL:
   
   | Field | Value |
   |-------|-------|
   | Server Name | `zoom-transcript-mcp` |
   | Command or URL | `https://abc123.ngrok.io` |
   | Arguments | *Leave empty* |

## Alternative: Deploy to a Public Server

For a more permanent solution, deploy your MCP server to a cloud provider:

1. **Create a server on a cloud provider** (AWS, Google Cloud, Heroku, etc.)

2. **Deploy your code**
   ```bash
   git clone https://github.com/harrisoncharlesworth/zoomcp.git
   cd zoomcp
   npm install
   npm start
   ```

3. **Update your AMP configuration with the cloud URL**
   
   | Field | Value |
   |-------|-------|
   | Server Name | `zoom-transcript-mcp` |
   | Command or URL | `https://your-cloud-url.com` |
   | Arguments | *Leave empty* |

## Verifying the Connection

To verify your public URL is working correctly:

1. Test the health endpoint: `https://your-public-url.com/health`
2. Test an AMP endpoint: `https://your-public-url.com/zoom-transcript-mcp/amp/zoom/summary?meetingId=123`

Both should return valid JSON responses.

## Security Considerations

When making your server publicly accessible:

1. **Use HTTPS** - ngrok provides this automatically
2. **Implement authentication** for production deployments
3. **Don't expose sensitive data** through your API
4. **Consider rate limiting** to prevent abuse