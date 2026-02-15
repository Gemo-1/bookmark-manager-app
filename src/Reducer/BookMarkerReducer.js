
export const BookMarkerReducer = (state, action) => {
    switch (action.type) {
        case "ADD_BOOKMARK": {
            const addBookmark = {
                id: Date.now(),
                title: action.payload.title,
                url: action.payload.url,
                tags: action.payload.tags || [],
                isArchived: false,
                isPinned: false,
                createdAt: new Date().toISOString(),
            }
            return [...state, addBookmark];
        }
        case "DELETE_BOOKMARK": {
            const deleteBookMArk = state.filter((mark) => mark.id !== action.payload);
            return deleteBookMArk;
        }
        case "EDIT_BOOKMARK": {
            const updatedBookMark = state.map((mark) => {
                if (mark.id === action.payload.id) {
                    return { ...mark, ...action.payload }
                } else {
                    return mark
                }
            })
            return updatedBookMark
        }
        case "TOGGLE_ARCHIVE": {
            const toggleArchive = state.map((mark) => {

                return mark.id === action.payload ? { ...mark, isArchived: !mark.isArchived } : mark
            })
            return toggleArchive
        }
        case "TOGGLE_PINNED": {
            const togglePinned = state.map((mark) => {
                return mark.id === action.payload ? { ...mark, isPinned: !mark.isPinned } : mark
            })
            return togglePinned
        }
        default:
            return state;
    }
}














////////////نهايه الملف
