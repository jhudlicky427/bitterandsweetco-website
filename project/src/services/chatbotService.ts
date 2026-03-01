import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MenuCategory {
  id: string;
  name: string;
  items: Array<{
    name: string;
    description: string;
    base_price: number;
  }>;
}

class ChatbotService {
  private menuCache: MenuCategory[] = [];
  private locationsCache: any[] = [];

  async initialize() {
    await this.loadMenuData();
    await this.loadLocations();
  }

  private async loadMenuData() {
    try {
      const { data: items } = await supabase
        .from('menu_items')
        .select('name, description, price, category')
        .eq('is_available', true)
        .order('display_order');

      if (items) {
        const categoryMap = new Map<string, typeof items>();
        items.forEach(item => {
          const category = item.category || 'classic';
          if (!categoryMap.has(category)) {
            categoryMap.set(category, []);
          }
          categoryMap.get(category)!.push(item);
        });

        this.menuCache = Array.from(categoryMap.entries()).map(([name, categoryItems]) => ({
          id: name,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          items: categoryItems.map(item => ({
            name: item.name,
            description: item.description,
            base_price: parseFloat(String(item.price))
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading menu data:', error);
    }
  }

  private async loadLocations() {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      this.locationsCache = data || [];
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  }

  async processMessage(userMessage: string): Promise<string> {
    const message = userMessage.toLowerCase().trim();

    if (this.isGreeting(message)) {
      return this.getGreeting();
    }

    if (this.isMenuQuery(message)) {
      return this.getMenuInfo(message);
    }

    if (this.isLocationQuery(message)) {
      return this.getLocationInfo();
    }

    if (this.isPriceQuery(message)) {
      return this.getPriceInfo(message);
    }

    if (this.isHoursQuery(message)) {
      return this.getHoursInfo();
    }

    if (this.isBookingQuery(message)) {
      return this.getBookingInfo();
    }

    if (this.isContactQuery(message)) {
      return this.getContactInfo();
    }

    if (this.isSpecialtyQuery(message)) {
      return this.getSpecialtyInfo();
    }

    return this.getDefaultResponse();
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isMenuQuery(message: string): boolean {
    const keywords = ['menu', 'drink', 'beverage', 'coffee', 'espresso', 'latte', 'mocha', 'tea', 'what do you have', 'what can i get', 'options'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isLocationQuery(message: string): boolean {
    const keywords = ['location', 'where', 'find you', 'address', 'visiting', 'come by'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isPriceQuery(message: string): boolean {
    const keywords = ['price', 'cost', 'how much', 'expensive', 'cheap', 'afford'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isHoursQuery(message: string): boolean {
    const keywords = ['hours', 'open', 'close', 'when', 'time', 'schedule'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isBookingQuery(message: string): boolean {
    const keywords = ['book', 'event', 'party', 'wedding', 'catering', 'hire', 'reservation'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isContactQuery(message: string): boolean {
    const keywords = ['contact', 'phone', 'email', 'reach', 'call', 'message'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isSpecialtyQuery(message: string): boolean {
    const keywords = ['specialty', 'special', 'signature', 'popular', 'recommend', 'best'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private getGreeting(): string {
    const greetings = [
      "Hello! Welcome to Bitter & Sweet Co.! How can I help you today?",
      "Hi there! I'm here to answer any questions about our coffee and treats!",
      "Hey! Thanks for stopping by. What would you like to know about Bitter & Sweet Co.?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getMenuInfo(message: string): string {
    if (this.menuCache.length === 0) {
      return "We offer a variety of delicious beverages including specialty coffee drinks, teas, and sweet treats! Check out our Menu page to see our full selection, or ask me about specific items.";
    }

    const categories = this.menuCache.map(cat => cat.name).join(', ');
    let response = `We have several categories: ${categories}.\n\n`;

    if (message.includes('signature') || message.includes('special')) {
      const signatureCategory = this.menuCache.find(cat =>
        cat.name.toLowerCase().includes('signature') || cat.name.toLowerCase().includes('specialty')
      );
      if (signatureCategory && signatureCategory.items.length > 0) {
        response += "Our signature drinks include:\n";
        signatureCategory.items.slice(0, 3).forEach(item => {
          response += `- ${item.name}: ${item.description}\n`;
        });
      }
    } else {
      response += "You can customize most drinks with different milk options, syrups, and toppings. Visit our Menu page to explore all options!";
    }

    return response;
  }

  private getLocationInfo(): string {
    if (this.locationsCache.length === 0) {
      return "We're a mobile coffee trailer serving the Denver Metro Area! Check our Locations page to see where we'll be next, or visit the Events Calendar to book us for your special occasion.";
    }

    let response = "Here's where you can find us:\n\n";
    this.locationsCache.slice(0, 3).forEach(location => {
      response += `📍 ${location.name}\n${location.address}\n`;
      if (location.hours) {
        response += `Hours: ${location.hours}\n`;
      }
      response += '\n';
    });

    response += "Check our Locations page for the complete schedule!";
    return response;
  }

  private getPriceInfo(message: string): string {
    if (this.menuCache.length === 0) {
      return "Our drinks typically range from $5 to $8, with customization options available. Check out our Menu page for specific pricing!";
    }

    let response = "Here's a sample of our pricing:\n\n";
    let count = 0;

    for (const category of this.menuCache) {
      if (count >= 3) break;
      for (const item of category.items) {
        if (count >= 3) break;
        response += `${item.name}: $${item.base_price.toFixed(2)}\n`;
        count++;
      }
    }

    response += "\nCustomizations may have additional charges. Visit our Menu page for complete pricing!";
    return response;
  }

  private getHoursInfo(): string {
    return "Our hours vary by location! We're a mobile coffee trailer, so our schedule changes based on events and locations. Check our Locations page or Events Calendar to see when and where we'll be serving next!";
  }

  private getBookingInfo(): string {
    return "We'd love to cater your event! We're available for:\n\n• Weddings\n• Corporate events\n• Private parties\n• Community gatherings\n• And more!\n\nHead to our Contact page to send us a message with your event details, or call us at (720) 735-2700. We'll work with you to create the perfect coffee experience for your guests!";
  }

  private getContactInfo(): string {
    return "You can reach us at:\n\n📞 Phone: (720) 735-2700\n📧 Email: info@bitterandsweetco.com\n\nOr fill out the contact form on our Contact page and we'll get back to you within 24 hours!";
  }

  private getSpecialtyInfo(): string {
    return "Our specialty is creating unique, high-quality coffee experiences! We're known for:\n\n• Handcrafted espresso drinks\n• Creative flavor combinations\n• Customizable beverages\n• Premium ingredients\n• Friendly, professional service\n\nTry one of our signature drinks or create your own masterpiece with our customization options!";
  }

  private getDefaultResponse(): string {
    const responses = [
      "I'm here to help! You can ask me about our menu, locations, hours, pricing, or booking us for events. What would you like to know?",
      "Great question! I can tell you about our drinks, where to find us, our prices, or how to book us for your event. What interests you?",
      "I'm not sure I understand, but I'm happy to help! Try asking me about our menu, locations, events, or contact information.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const chatbotService = new ChatbotService();
