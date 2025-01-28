export function initMarketTicker() {
    const tickerTrack = document.querySelector('.ticker-track');
    if (!tickerTrack) return;

    // Clone ticker items for seamless scrolling
    tickerTrack.innerHTML += tickerTrack.innerHTML;

    // Update market data
    function updateMarketData() {
        const tickerItems = document.querySelectorAll('.ticker-item');
        tickerItems.forEach(item => {
            const priceElement = item.querySelector('.price');
            const changeElement = item.querySelector('.change');
            
            if (priceElement && changeElement) {
                // Simulate real-time data updates
                const currentPrice = parseFloat(priceElement.textContent.replace(/[^0-9.-]+/g, ""));
                const change = (Math.random() * 2 - 1) * 0.5; // Random change between -0.5% and +0.5%
                const newPrice = (currentPrice * (1 + change/100)).toFixed(2);
                
                priceElement.textContent = newPrice;
                changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
                
                // Update classes for styling
                priceElement.className = `price ${change >= 0 ? 'up' : 'down'}`;
                changeElement.className = `change ${change >= 0 ? 'up' : 'down'}`;
            }
        });
    }

    // Update market data every 5 seconds
    setInterval(updateMarketData, 5000);
}
