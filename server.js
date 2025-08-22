const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Example API endpoint
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from your Express server!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// Scraper endpoint for Newegg
app.get("/scrape/newegg", async (req, res) => {
  const { q } = req.query; // example: /scrape/newegg?q=wireless+mouse
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter ?q=" });
  }

  try {
    const searchUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(q)}`;
    const { data } = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }, // helps avoid being blocked
    });

    const $ = cheerio.load(data);
    let results = [];

    $(".item-cell").each((_, el) => {
      const title = $(el).find(".item-title").text().trim();
      const price = $(el).find(".price-current strong").text().trim();
      const cents = $(el).find(".price-current sup").text().trim();
      const link = $(el).find(".item-title").attr("href");

      if (title && price) {
        results.push({
          title,
          price: cents ? `${price}${cents}` : price,
          link,
        });
      }
    });

    res.json({ query: q, results });
  } catch (error) {
    console.error("Scraper error:", error.message);
    res.status(500).json({ error: "Failed to scrape Newegg" });
  }
});

module.exports = app;
