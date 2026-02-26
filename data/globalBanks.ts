
export interface BankEntry {
  name: string;
  domain: string;
  gradient?: string; // Tailwind gradient classes
  textColor?: string; // 'text-white' or 'text-slate-900'
}

// Liste étendue des principales institutions ET Services (Tech, Streaming, Shopping)
export const GLOBAL_BANKS: BankEntry[] = [
  // --- TECH & SERVICES ---
  { name: "Google", domain: "google.com", gradient: "from-blue-500 via-red-500 to-yellow-500" },
  { name: "Gmail", domain: "gmail.com", gradient: "from-red-500 to-red-700" },
  { name: "Apple", domain: "apple.com", gradient: "from-gray-800 to-black" },
  { name: "iCloud", domain: "icloud.com", gradient: "from-blue-400 to-blue-600" },
  { name: "Amazon", domain: "amazon.com", gradient: "from-slate-800 to-slate-900", textColor: "text-orange-400" },
  { name: "Microsoft", domain: "microsoft.com", gradient: "from-blue-600 to-cyan-600" },
  { name: "Facebook", domain: "facebook.com", gradient: "from-blue-600 to-blue-800" },
  { name: "Instagram", domain: "instagram.com", gradient: "from-purple-500 via-pink-500 to-orange-500" },
  { name: "Twitter", domain: "twitter.com", gradient: "from-sky-500 to-blue-600" },
  { name: "X", domain: "x.com", gradient: "from-slate-900 to-black" },
  { name: "LinkedIn", domain: "linkedin.com", gradient: "from-blue-700 to-blue-900" },
  { name: "TikTok", domain: "tiktok.com", gradient: "from-slate-900 via-black to-slate-900" }, // Special handling usually needed for RGB split effect, but dark fits
  { name: "Snapchat", domain: "snapchat.com", gradient: "from-yellow-300 to-yellow-500", textColor: "text-black" },
  { name: "Discord", domain: "discord.com", gradient: "from-indigo-500 to-indigo-700" },
  { name: "Slack", domain: "slack.com", gradient: "from-purple-800 to-slate-900" },
  { name: "GitHub", domain: "github.com", gradient: "from-slate-800 to-black" },
  { name: "GitLab", domain: "gitlab.com", gradient: "from-orange-500 to-orange-700" },
  
  // --- STREAMING ---
  { name: "Netflix", domain: "netflix.com", gradient: "from-red-700 to-red-950" },
  { name: "YouTube", domain: "youtube.com", gradient: "from-red-600 to-red-800" },
  { name: "Disney+", domain: "disneyplus.com", gradient: "from-blue-900 via-blue-800 to-slate-900" },
  { name: "Spotify", domain: "spotify.com", gradient: "from-green-500 to-green-800" },
  { name: "Twitch", domain: "twitch.tv", gradient: "from-purple-600 to-purple-900" },
  { name: "Prime Video", domain: "primevideo.com", gradient: "from-blue-500 to-cyan-600" },
  { name: "Canal+", domain: "canalplus.com", gradient: "from-slate-900 to-black" },

  // --- FRANCE BANKS ---
  { name: "Crédit Agricole", domain: "credit-agricole.fr", gradient: "from-teal-600 to-teal-800" },
  { name: "BNP Paribas", domain: "mabanque.bnpparibas", gradient: "from-emerald-700 to-emerald-900" },
  { name: "Société Générale", domain: "particuliers.societegenerale.fr", gradient: "from-red-600 to-black" },
  
  // UPDATED: BoursoBank (Black) & Freedom (Silver/Grey with Pink hint)
  { name: "BoursoBank", domain: "boursobank.com", gradient: "from-gray-900 via-black to-gray-800" }, 
  { name: "Freedom", domain: "boursobank.com", gradient: "from-slate-400 via-slate-500 to-pink-900" }, // Silver with dark pink corner

  { name: "Revolut", domain: "revolut.com", gradient: "from-blue-500 to-pink-500" }, // Revolut gradient
  { name: "N26", domain: "n26.com", gradient: "from-teal-400 to-teal-600" },
  { name: "Qonto", domain: "qonto.com", gradient: "from-purple-600 to-purple-800" },
  
  // --- US/GLOBAL BANKS ---
  { name: "Chase", domain: "chase.com", gradient: "from-blue-800 to-blue-950" },
  { name: "Bank of America", domain: "bankofamerica.com", gradient: "from-red-600 to-blue-800" },
  { name: "Wells Fargo", domain: "wellsfargo.com", gradient: "from-red-700 to-yellow-600" },
  { name: "Citi", domain: "citi.com", gradient: "from-blue-500 to-blue-700" },
  { name: "Amex", domain: "americanexpress.com", gradient: "from-blue-400 to-cyan-600" },
  { name: "PayPal", domain: "paypal.com", gradient: "from-blue-600 to-blue-800" },
  { name: "Stripe", domain: "stripe.com", gradient: "from-indigo-500 to-purple-600" },
  { name: "Wise", domain: "wise.com", gradient: "from-lime-400 to-green-600", textColor: "text-slate-900" },
];