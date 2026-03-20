import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../constants";

const Editable = ({ tagName = "span", id, defaultContent, className = "", onSave }) => {
  const TagEl = tagName;
  const { isAdmin } = useAuth();
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    if (!API_BASE) return;
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/content/${encodeURIComponent(id)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data && typeof data.content === "string") {
            setContent(data.content);
          }
        }
      } catch {
        if (!ignore) {
          setContent((prev) => prev || defaultContent);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [API_BASE, id, defaultContent]);

  const handleBlur = (e) => {
    const newContent = e.target.innerText;
    setContent(newContent);
    if (API_BASE) {
      fetch(`${API_BASE}/api/content/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ content: newContent }),
      }).then(res => {
        if (res.ok && onSave) onSave(newContent);
      }).catch(() => { });
    }
  };

  if (!isAdmin) {
    return <TagEl className={className}>{content}</TagEl>;
  }

  return (
    <span className="relative group/editable inline-block">
      <TagEl
        contentEditable
        onBlur={handleBlur}
        suppressContentEditableWarning={true}
        className={`${className} outline-none focus:ring-1 focus:ring-white/20 px-1 -mx-1 rounded transition-all cursor-text min-w-[20px]`}
      >
        {content}
      </TagEl>

      <span className="absolute -top-6 left-0 opacity-0 group-hover/editable:opacity-100 transition-opacity bg-white text-black text-[8px] font-mono px-1 py-0.5 rounded pointer-events-none z-50 whitespace-nowrap uppercase tracking-widest">
        Edit: {id}
      </span>
    </span>
  );
};

export default Editable;
