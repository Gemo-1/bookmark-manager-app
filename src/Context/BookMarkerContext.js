import { useReducer, createContext, useEffect } from 'react';
import { BookMarkerReducer } from '../Reducer/BookMarkerReducer';

export const BookMarkerContext = createContext([])
export const DispatchContext = createContext(null)
const initialData = [
    { id: 1, title: "Google", url: "https://www.google.com", tags: ["Search", "Tool"], isPinned: true, isArchived: false, createdAt: new Date().toISOString() },
    { id: 2, title: "GitHub", url: "https://www.github.com", tags: ["Coding", "Git", "Dev"], isPinned: true, isArchived: false, createdAt: new Date().toISOString() },
    { id: 3, title: "YouTube", url: "https://www.youtube.com", tags: ["Video", "Entertainment"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },
    { id: 4, title: "React.js", url: "https://react.dev", tags: ["Frontend", "Framework"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },
    { id: 5, title: "MUI Library", url: "https://mui.com", tags: ["UI", "Design"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },
    { id: 6, title: "ChatGPT", url: "https://chatgpt.com", tags: ["AI", "Helper"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },
    { id: 7, title: "MDN Web Docs", url: "https://developer.mozilla.org", tags: ["Documentation", "Web"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },
    { id: 8, title: "Figma", url: "https://www.figma.com", tags: ["Design", "UI/UX"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },
    { id: 9, title: "NPM", url: "https://www.npmjs.com", tags: ["Packages", "NodeJS"], isPinned: false, isArchived: false, createdAt: new Date().toISOString() },

    { id: 10, title: "Stack Overflow", url: "https://stackoverflow.com", tags: ["Coding", "Archive"], isPinned: false, isArchived: true, createdAt: new Date().toISOString() },
    { id: 11, title: "LinkedIn", url: "https://www.linkedin.com", tags: ["Jobs", "Professional"], isPinned: false, isArchived: true, createdAt: new Date().toISOString() },
    { id: 12, title: "Pinterest", url: "https://www.pinterest.com", tags: ["Design", "Images"], isPinned: false, isArchived: true, createdAt: new Date().toISOString() }
];
export const BookMarkerProvider = ({ children }) => {
    const [bookmarks, dispatch] = useReducer(BookMarkerReducer, [], () => {
        const localData = localStorage.getItem("bookmarks");
        return localData ? JSON.parse(localData) : [...initialData];
    });

    useEffect(() => {
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    return (
        <BookMarkerContext.Provider value={bookmarks}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </BookMarkerContext.Provider>
    )
}



////////////نهايه الملف

