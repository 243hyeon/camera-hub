import Parser from 'rss-parser';

export interface NewsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    imageUrl: string;
    thumbnail?: string; // Added for compatibility
    source: string;
}

const parser = new Parser();

const RSS_FEEDS = [
    { name: 'DPReview', url: 'https://www.dpreview.com/feeds/rss/latest' },
    { name: 'PetaPixel', url: 'https://petapixel.com/feed/' },
];

export async function getLatestNews(): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    for (const feed of RSS_FEEDS) {
        try {
            const parsedFeed = await parser.parseURL(feed.url);

            parsedFeed.items.forEach((item) => {
                // Extract image from content or enclosure
                let imageUrl = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop';

                // Try to find image in enclosure
                if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                }
                // Try to find image in content:encoded or content
                else if (item.content) {
                    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }
                else if (item['content:encoded']) {
                    const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                allNews.push({
                    id: item.guid || item.link || Math.random().toString(),
                    title: item.title || 'Untitled',
                    link: item.link || '#',
                    pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString('ko-KR') : '',
                    contentSnippet: item.contentSnippet ? item.contentSnippet.slice(0, 150) + '...' : '',
                    imageUrl: imageUrl,
                    thumbnail: imageUrl,
                    source: feed.name
                });
            });
        } catch (error) {
            console.error(`Error fetching RSS from ${feed.name}:`, error);
        }
    }

    // Sort by date (descending)
    return allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
