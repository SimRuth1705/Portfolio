import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star, GitCommit, Code2, GitFork, Users, ExternalLink, Activity } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Editable from "./Editable";
import { API_BASE } from "../constants";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

const StatCard = ({ icon, label, value, isDark, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`group relative p-6 border transition-all duration-500 ${isDark ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]" : "border-black/5 bg-black/[0.02] hover:bg-black/[0.04]"}`}
  >
    <div className={`flex items-center gap-4`}>
      <div className={`p-3 rounded-lg ${isDark ? "bg-white/5 text-white" : "bg-black/5 text-black"}`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-display font-black ${isDark ? "text-white" : "text-black"}`}>{value}</p>
        <p className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{label}</p>
      </div>
    </div>
  </motion.div>
);

const RepoCard = ({ repo, isDark, delay }) => (
  <motion.a
    href={repo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5 }}
    className={`p-6 border block flex flex-col justify-between h-full transition-all duration-300 group/card ${isDark ? "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]" : "border-black/5 bg-black/[0.02] hover:border-black/20 hover:bg-black/[0.04]"}`}
  >
    <div>
      <div className="flex justify-between items-start mb-4">
        <Code2 size={20} className={isDark ? "text-zinc-500 group-hover/card:text-white" : "text-zinc-400 group-hover/card:text-black"} />
        <ExternalLink size={14} className="text-zinc-600 transition-colors" />
      </div>
      <h3 className={`text-lg font-bold mb-2 truncate ${isDark ? "text-white" : "text-black"}`}>{repo.name}</h3>
      <p className={`text-xs leading-relaxed mb-6 line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
        {repo.description || "No description provided."}
      </p>
    </div>
    <div className="flex items-center gap-4 font-mono text-[10px]">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#2ea043" }} />
        {repo.language || "Misc"}
      </div>
      <div className="flex items-center gap-1 text-zinc-500">
        <Star size={12} /> {repo.stargazers_count}
      </div>
      <div className="flex items-center gap-1 text-zinc-500">
        <GitFork size={12} /> {repo.forks_count}
      </div>
    </div>
  </motion.a>
);

const ActivityItem = ({ event, isDark, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`flex items-start gap-4 pb-8 border-l-2 relative ml-2 ${isDark ? "border-white/5" : "border-black/5"}`}
    >
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200"}`} />
      <div className="flex-1">
        <p className={`text-[9px] font-mono uppercase tracking-widest mb-1 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
          {new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className={`text-xs mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
          <span className="opacity-60 text-[10px] tracking-tighter">COMMITTED TO</span>{" "}
          <span className="font-bold underline decoration-[#2ea043]/40 underline-offset-4">{event.repo.name.split("/")[1]}</span>
        </p>
        <p className={`text-[11px] leading-relaxed line-clamp-3 ${isDark ? "text-zinc-500" : "text-zinc-500"} italic font-serif`}>
          "{event.message || 'No commit message available'}"
        </p>
      </div>
    </motion.div>
  );
};

const LanguageBar = ({ name, percentage, color, isDark }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className={`text-[9px] font-mono uppercase tracking-widest w-24 text-right ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{name}</span>
    <div className={`flex-1 h-1.5 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full"
        style={{ backgroundColor: color }}
      />
    </div>
    <span className={`text-[9px] font-mono w-10 ${isDark ? "text-zinc-600" : "text-zinc-300"}`}>{percentage}%</span>
  </div>
);

const GitHubStats = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ repos: 0, stars: 0, followers: 0, following: 0 });
  const [githubUser, setGithubUser] = useState("SimRuth1705");
  const [dynamicLanguages, setDynamicLanguages] = useState(null);
  const [featuredRepos, setFeaturedRepos] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackStats = { repos: 12, stars: 24, followers: 8, following: 15 };

  const getLanguageColor = (lang) => {
    const colors = {
      JavaScript: "#f7df1e", Java: "#b07219", Python: "#3572A5", HTML: "#e34c26", 
      CSS: "#563d7c", TypeScript: "#3178c6", "C++": "#f34b7d", Shell: "#89e051"
    };
    return colors[lang] || "#888888";
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/content/github_username`);
        if (res.ok) {
          const data = await res.json();
          if (data?.content) setGithubUser(data.content);
        }
      } catch (err) { console.error("Failed to fetch github_username:", err); }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

    const fetchStats = async () => {
      try {
        setLoading(true);
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUser}`, { headers }),
          fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`, { headers })
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error("API Limit or User Not Found");
        
        const user = await userRes.json();
        const repos = await reposRes.json();

        // Fetch commits from top 10 most recently updated repos
        const commitPromises = repos.slice(0, 10).map(repo => 
          fetch(`https://api.github.com/repos/${repo.full_name}/commits?author=${githubUser}&per_page=15`, { headers })
            .then(async res => {
              if (!res.ok) return [];
              const commits = await res.json();
              return commits.map(c => ({
                id: c.sha,
                created_at: c.commit?.author?.date || c.commit?.committer?.date,
                message: c.commit?.message || "Commit details unavailable",
                repo: { name: repo.full_name }
              }));
            })
            .catch(() => [])
        );

        const allCommits = (await Promise.all(commitPromises)).flat();
        const sortedCommits = allCommits.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50);
        
        setActivities(sortedCommits);
        setFeaturedRepos([...repos].sort((a, b) => b.stargazers_count - a.stargazers_count));

        const langPromises = repos.slice(0, 10).map(repo =>
          fetch(repo.languages_url, { headers }).then(res => res.ok ? res.json() : {})
        );
        const languagesArray = await Promise.all(langPromises);
        const aggregation = {};
        languagesArray.forEach(repoLangs => {
          Object.entries(repoLangs).forEach(([lang, bytes]) => {
            aggregation[lang] = (aggregation[lang] || 0) + bytes;
          });
        });

        const totalBytes = Object.values(aggregation).reduce((sum, b) => sum + b, 0);
        const sortedLangs = Object.entries(aggregation)
          .sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([name, bytes]) => ({
            name, percentage: Math.round((bytes / totalBytes) * 100), color: getLanguageColor(name)
          }));

        setDynamicLanguages(sortedLangs);
        setStats({
          repos: user.public_repos, stars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
          followers: user.followers, following: user.following,
        });
      } catch (err) {
        console.error("GitHub Fetch Error:", err);
        setStats(fallbackStats);
      } finally { setLoading(false); }
    };

    fetchStats();
  }, [githubUser]);

  return (
    <section id="github" className={`py-32 md:py-60 px-4 md:px-10 border-b relative ${isDark ? "border-white/10" : "border-black/5"}`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-4">
              <span className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-500"}`}>
                [ 05. NETWORK ]
              </span>
              <div className="h-[2px] w-8 bg-[#2ea043]" />
              <span className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                <Editable id="github_status" defaultContent="Live Network Sync" />
              </span>
              <div className="w-2 h-2 rounded-full bg-[#2ea043] animate-pulse" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className={`text-6xl md:text-9xl font-display font-black uppercase ${isDark ? "text-white" : "text-black"} flex flex-wrap gap-4 items-baseline`}>
              <Editable id="github_title" defaultContent="GITHUB FEED" />
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl md:text-5xl font-mono lowercase tracking-tighter ${isDark ? "text-white/20" : "text-black/10"}`}>@</span>
                <span className="text-3xl md:text-5xl font-mono tracking-tight text-[#2ea043]">
                  <Editable id="github_username" defaultContent={githubUser} onSave={(val) => setGithubUser(val)} />
                </span>
              </div>
            </motion.h2>
          </div>
          
          <motion.a
            href={`https://github.com/${githubUser}`} target="_blank" rel="noopener noreferrer"
            className={`group flex items-center gap-4 border px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 ${isDark ? "border-white/10 hover:bg-white hover:text-black" : "border-black/10 hover:bg-black hover:text-white"}`}
          >
            <Github size={18} /> OPEN PROFILE <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </div>

        {/* Stats & Featured */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <StatCard icon={<Code2 size={18} />} label="Repos" value={loading ? "—" : stats.repos} isDark={isDark} delay={0} />
              <StatCard icon={<Star size={18} />} label="Stars" value={loading ? "—" : stats.stars} isDark={isDark} delay={0.1} />
              <StatCard icon={<Users size={18} />} label="Network" value={loading ? "—" : stats.followers} isDark={isDark} delay={0.2} />
              <StatCard icon={<Activity size={18} />} label="Events" value={loading ? "—" : activities.length} isDark={isDark} delay={0.3} />
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`h-px flex-1 ${isDark ? "bg-white/5" : "bg-black/5"}`} />
                <h3 className={`text-[10px] font-mono uppercase tracking-[0.4em] ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Featured_Repositories</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRepos.map((repo, idx) => (
                  <RepoCard key={repo.id} repo={repo} isDark={isDark} delay={0.1 * idx} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-12">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className={`p-8 border ${isDark ? "border-white/5 bg-white/[0.01]" : "border-black/5 bg-black/[0.01]"}`}>
                <h3 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-8 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Stack_Weight</h3>
                {dynamicLanguages ? dynamicLanguages.map((lang) => (
                  <LanguageBar key={lang.name} {...lang} isDark={isDark} />
                )) : [1,2,3,4,5].map(i => <div key={i} className="h-6 mb-3 animate-pulse bg-white/5" />)}
              </motion.div>

              <div className={`p-8 border ${isDark ? "border-white/5" : "border-black/5"}`}>
                <h3 className={`text-[10px] font-mono uppercase tracking-[0.4em] mb-8 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>System_Events</h3>
                <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                  <AnimatePresence>
                    {activities.map((event, idx) => (
                      <ActivityItem key={event.id} event={event} isDark={isDark} delay={0.05 * idx} />
                    ))}
                  </AnimatePresence>
                  {!loading && activities.length === 0 && <div className="text-[10px] font-mono opacity-20">No recent events detected.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2ea043; }
      `}} />
    </section>
  );
};

export default GitHubStats;
