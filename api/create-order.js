const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://dacapomds.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle preflight and HEAD requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Verify GitHub token is configured
  if (!process.env.GITHUB_API_TOKEN) {
    console.error('GitHub token not found in environment');
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'GitHub token not configured'
    });
  }

  // Handle HEAD requests after token verification
  if (req.method === 'HEAD') {
    // For HEAD requests, just verify we can connect to GitHub API
    try {
      const response = await fetch('https://api.github.com/repos/DaCapoMDS/Webshop_PATtest', {
        method: 'HEAD',
        headers: {
          'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'KochiWebshop'
        }
      });
      
      if (response.ok) {
        res.status(200).end();
      } else {
        res.status(response.status).end();
      }
    } catch (error) {
      res.status(500).end();
    }
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      details: 'Only POST requests are supported'
    });
  }

  const orderData = req.body;
  if (!orderData) {
    return res.status(400).json({
      error: 'Bad request',
      details: 'Order data is required'
    });
  }

  try {
    // First get the current counter value
    const counterResponse = await fetch(
      'https://api.github.com/repos/DaCapoMDS/Webshop_PATtest/contents/docs/orders/counter.txt',
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'KochiWebshop'
        }
      }
    );

    if (!counterResponse.ok) {
      throw new Error('Failed to read order counter');
    }

    const counterData = await counterResponse.json();
    const currentCounter = parseInt(Buffer.from(counterData.content, 'base64').toString('utf-8'));
    const newCounter = currentCounter + 1;

    // Prepare the order with number
    const order = {
      ...orderData,
      orderNumber: newCounter
    };

    // Create the order file
    const orderContent = JSON.stringify(order, null, 2);
    const orderResponse = await fetch(
      `https://api.github.com/repos/DaCapoMDS/Webshop_PATtest/contents/docs/orders/order_${newCounter}.json`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'KochiWebshop'
        },
        body: JSON.stringify({
          message: `Create order ${newCounter}`,
          content: Buffer.from(orderContent).toString('base64')
        })
      }
    );

    if (!orderResponse.ok) {
      throw new Error('Failed to create order file');
    }

    // Update the counter
    const counterUpdateResponse = await fetch(
      'https://api.github.com/repos/DaCapoMDS/Webshop_PATtest/contents/docs/orders/counter.txt',
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'KochiWebshop'
        },
        body: JSON.stringify({
          message: 'Increment order counter',
          content: Buffer.from(newCounter.toString()).toString('base64'),
          sha: counterData.sha
        })
      }
    );

    if (!counterUpdateResponse.ok) {
      throw new Error('Failed to update counter');
    }

    return res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: newCounter,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};