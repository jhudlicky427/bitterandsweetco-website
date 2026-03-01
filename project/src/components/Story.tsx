import { Sparkles, Award, Users } from 'lucide-react';

export default function Story() {
  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)' }}>
            Our Story
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 animate-pulse-glow"></div>
        </div>

        <div className="space-y-12">
          <div className="glass-effect rounded-2xl p-8 md:p-12 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 animate-fade-in-up relative overflow-hidden group transform hover:scale-105">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="prose prose-lg max-w-none relative">
              <p className="text-xl text-gray-100 leading-relaxed mb-6" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                Our goal was to create more than a mobile beverage trailer—we set out to build an experience
                centered on quality, craftsmanship, and connection. From our handcrafted lemonades to refreshing
                teas and thoughtfully curated dirty sodas, every beverage is made with care and attention to balance,
                using quality ingredients to deliver bold yet approachable flavors.
              </p>
              <p className="text-lg text-gray-200 leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                Today, our trailer serves as a welcoming mobile gathering space and a conversation starter—designed
                to enhance community events, private celebrations, and local gatherings. Wherever we set up, our focus
                remains the same: exceptional service, consistent quality, and creating memorable experiences through
                handcrafted beverages.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-indigo-400/60 text-center space-y-4 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 transform hover:-translate-y-3 hover:scale-110 animate-fade-in-up cursor-pointer">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/50 to-purple-600/50 text-indigo-200 mx-auto shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Sparkles size={36} className="animate-float" />
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Craftsmanship</h3>
              <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                Every beverage is handcrafted with care and attention to balance, using quality ingredients for bold yet approachable flavors.
              </p>
            </div>

            <div className="group glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-purple-400/60 text-center space-y-4 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-3 hover:scale-110 animate-fade-in-up cursor-pointer" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-600/50 text-purple-200 mx-auto shadow-xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Award size={36} className="animate-float" style={{ animationDelay: '0.5s' }} />
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Quality</h3>
              <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                From ingredients to service, we maintain exceptional standards and consistency at every event we serve.
              </p>
            </div>

            <div className="group glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-pink-400/60 text-center space-y-4 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 transform hover:-translate-y-3 hover:scale-110 animate-fade-in-up cursor-pointer" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/50 to-purple-600/50 text-pink-200 mx-auto shadow-xl group-hover:shadow-pink-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Users size={36} className="animate-float" style={{ animationDelay: '1s' }} />
              </div>
              <h3 className="text-2xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Connection</h3>
              <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                Creating memorable gathering spaces that enhance community events, private celebrations, and local connections.
              </p>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8 md:p-12 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 animate-fade-in-up relative overflow-hidden group transform hover:scale-105" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-3xl font-bold text-white mb-8 text-center relative" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              What Makes Us Different
            </h3>
            <div className="space-y-6 relative">
              <div className="flex items-start space-x-4 group/item">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 mt-2 flex-shrink-0 shadow-lg group-hover/item:shadow-indigo-400/50 transition-all duration-500"></div>
                <p className="text-lg text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  <span className="font-bold text-purple-300">Handcrafted Excellence:</span> From lemonades to teas and dirty sodas, every beverage is thoughtfully balanced with quality ingredients.
                </p>
              </div>
              <div className="flex items-start space-x-4 group/item">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 mt-2 flex-shrink-0 shadow-lg group-hover/item:shadow-purple-400/50 transition-all duration-500"></div>
                <p className="text-lg text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  <span className="font-bold text-purple-300">Custom-Built Trailer:</span> A visually distinctive, efficient mobile beverage experience designed to serve at any event.
                </p>
              </div>
              <div className="flex items-start space-x-4 group/item">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 mt-2 flex-shrink-0 shadow-lg group-hover/item:shadow-pink-400/50 transition-all duration-500"></div>
                <p className="text-lg text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  <span className="font-bold text-purple-300">Community Focused:</span> Designed to enhance events and create memorable gathering spaces wherever we serve.
                </p>
              </div>
              <div className="flex items-start space-x-4 group/item">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-pink-600 mt-2 flex-shrink-0 shadow-lg group-hover/item:shadow-indigo-400/50 transition-all duration-500"></div>
                <p className="text-lg text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  <span className="font-bold text-purple-300">Consistent Quality:</span> Exceptional service and carefully crafted beverages at every event, every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
