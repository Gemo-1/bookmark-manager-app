import {
    Container, Button, TextField, Box, IconButton,
    Stack, Typography, InputAdornment, Avatar, Grid, Drawer
} from "@mui/material";
import { useContext, useState } from "react";
import { DispatchContext, BookMarkerContext } from "../Context/BookMarkerContext";

// Icons
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BookmarkCard from "./BookmarkCard ";
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// Dialog Components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';

export default function BookmarkList() {
    const bookmarks = useContext(BookMarkerContext);
    const dispatch = useContext(DispatchContext);

    // States
    const [displayBookMarksType, setDisplayBookMarksType] = useState("home");
    const [searchText, setSearchText] = useState("");
    const [titelValue, setTitelValue] = useState("");
    const [urlValue, setUrlValue] = useState("");
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [order, setOrder] = useState('asc');
    const [editingBook, setEditingBook] = useState(null);
    const [tagsValue, setTagsValue] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);

    // Save Bookmark (Add/Edit)
    function handleSave() {
        if (!titelValue || !urlValue) return;

        // تحويل النص إلى مصفوفة (الكلمات المفصولة بفاصلة)
        const tagsArray = tagsValue.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        const action = editingBook ? "EDIT_BOOKMARK" : "ADD_BOOKMARK";
        const payload = {
            title: titelValue,
            url: urlValue,
            tags: tagsArray,
            ...(editingBook && { id: editingBook.id })
        };

        dispatch({ type: action, payload });
        handleClose();
        setTagsValue("");
    }
    // Drawer State for Mobile/Tablet
    const [mobileOpen, setMobileOpen] = useState(false);
    const toggleDrawer = () => setMobileOpen(!mobileOpen);

    // Logic
    const homeLength = bookmarks.filter(b => !b.isArchived).length;
    const archivedLength = bookmarks.filter(b => b.isArchived).length;

    const visibleBookmarks = bookmarks
        .filter(b => displayBookMarksType === "archived" ? b.isArchived : !b.isArchived)
        .filter(b => searchText.trim() ? b.title.toLowerCase().includes(searchText.toLowerCase()) : true)
        .filter(b => selectedTag ? b.tags.includes(selectedTag) : true)
        .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return Number(b.isPinned) - Number(a.isPinned);
            let comparison = 0;
            if (sortBy === "alphabetical") comparison = a.title.localeCompare(b.title);
            else comparison = new Date(a.createdAt) - new Date(b.createdAt);
            return order === "desc" ? -comparison : comparison;
        });

    function handleClose() {
        setOpen(false);
        setUrlValue("");
        setTitelValue("");
        setEditingBook(null);
        setTagsValue("");
    }
    const allTags = bookmarks.reduce((acc, book) => {
        if (book.tags) {
            book.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
        }
        return acc;
    }, {});

    // Shared Sidebar Component Logic
    const SidebarContent = (
        <Box sx={{ px: 2, py: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5, px: 1 }}>
                <BookmarkBorderOutlinedIcon sx={{ color: '#fff', backgroundColor: '#004744', p: 0.5, borderRadius: 1.5, fontSize: 20 }} />
                <Typography fontWeight={600} fontSize={16} color="#004744">Bookmark Manager</Typography>
            </Box>
            <Stack spacing={1}>
                <Button
                    fullWidth
                    startIcon={<HomeOutlinedIcon sx={{ fontSize: 18 }} />}
                    onClick={() => { setDisplayBookMarksType("home"); setMobileOpen(false); }}
                    sx={{
                        justifyContent: 'flex-start', textTransform: 'none', borderRadius: 2.5, p: 1.5,
                        backgroundColor: displayBookMarksType === 'home' ? '#E6F2F1' : 'transparent',
                        color: '#014746', fontWeight: displayBookMarksType === 'home' ? 700 : 500
                    }}
                >
                    Home <Box sx={{ ml: 'auto', opacity: 0.7 }}>{homeLength}</Box>
                </Button>
                <Button
                    fullWidth
                    startIcon={<Inventory2OutlinedIcon />}
                    onClick={() => { setDisplayBookMarksType('archived'); setMobileOpen(false); }}
                    sx={{
                        justifyContent: 'flex-start', textTransform: 'none', borderRadius: 2.5, p: 1.5,
                        backgroundColor: displayBookMarksType === 'archived' ? '#E6F2F1' : 'transparent',
                        color: '#014746', fontWeight: displayBookMarksType === 'archived' ? 700 : 500
                    }}
                >
                    Archived <Box sx={{ ml: 'auto', opacity: 0.7 }}>{archivedLength}</Box>
                </Button>
                {/* داخل SidebarContent */}
                <Typography variant="caption" sx={{ px: 2, fontWeight: 800, color: '#94A3B8', letterSpacing: 1, textTransform: 'uppercase', mt: 4, mb: 1, display: 'block' }}>
                    Tags
                </Typography>

                <Stack spacing={0.5} sx={{ px: 1 }}>
                    {/* خيار "عرض الكل" */}
                    <Button
                        fullWidth
                        startIcon={<LabelOutlinedIcon />}
                        onClick={() => {
                            setSelectedTag(null)
                            toggleDrawer();
                        }
                        }
                        sx={{
                            justifyContent: 'flex-start', textTransform: 'none', borderRadius: 2,
                            color: !selectedTag ? '#014746' : '#64748B',
                            bgcolor: !selectedTag ? '#F0F7F7' : 'transparent',
                            fontWeight: !selectedTag ? 700 : 500
                        }}
                    >
                        All Tags
                    </Button>

                    {/* عرض التاغات المستخرجة ديناميكياً */}
                    {Object.keys(allTags).map(tag => (
                        <Box
                            key={tag}
                            onClick={() => { setSelectedTag(tag); toggleDrawer(); }}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                px: 1.5, py: 1, borderRadius: 2, cursor: 'pointer',
                                transition: '0.2s',
                                bgcolor: selectedTag === tag ? '#F0F7F7' : 'transparent',
                                '&:hover': { bgcolor: '#F8FAFA' }
                            }}
                        >
                            <Box
                                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid #CBD5E1' }} />
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontWeight: selectedTag === tag ? 700 : 500,
                                        color: selectedTag === tag ? '#014746' : '#475569'
                                    }}>
                                    {tag}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                                {allTags[tag]}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </Box>
    );

    return (
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>

            {/* 1. Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
                }}
            >
                {SidebarContent}
            </Drawer>

            <Grid container sx={{ width: '100%' }}>
                {/* 2. Desktop Sidebar (Static) */}
                <Grid size={{ md: 3, lg: 2.5 }} sx={{
                    display: { xs: 'none', md: 'block' },
                    borderRight: '1px solid #F0F0F0',
                    position: 'sticky',
                    top: 0,
                    height: '100vh'
                }}>
                    {SidebarContent}
                </Grid>

                {/* 3. Main Content Section */}
                <Grid size={{ xs: 12, md: 9, lg: 9.5 }} sx={{ bgcolor: '#F8FAFA' }}>
                    {/* Responsive Header */}
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        px: { xs: 2, md: 4 }, py: 2, bgcolor: '#fff', borderBottom: '1px solid #F0F0F0'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Menu Button for Mobile */}
                            <IconButton
                                onClick={toggleDrawer}
                                sx={{ display: { md: 'none' }, color: '#014746' }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <TextField
                                size="small"
                                placeholder="Search..."
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                sx={{
                                    width: { xs: '150px', sm: '300px', lg: '400px' },
                                    "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: '#F3F6F6', border: 'none' },
                                    "& fieldset": { border: 'none' }
                                }}
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => setOpen(true)}
                                sx={{
                                    backgroundColor: '#014746', borderRadius: 2, textTransform: 'none',
                                    px: { xs: 1.5, sm: 3 }, fontWeight: 600, boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#003332', boxShadow: 'none' }
                                }}
                            >
                                <AddOutlinedIcon sx={{ mr: { sm: 1 } }} />
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>Add Bookmark</Box>
                            </Button>
                            <Avatar sx={{ width: 40, height: 40 }}></Avatar>
                        </Box>
                    </Box>

                    {/* Scrollable Content Area */}
                    <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                            <Typography variant="h5" fontWeight={800} color="#1A1C1E">
                                {displayBookMarksType === 'home' ? 'My Library' : 'Archive'}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                <TextField
                                    select size="small" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                    SelectProps={{ native: true }}
                                    sx={{ width: 100, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: '#fff' } }}
                                >
                                    <option value="newest">Latest</option>
                                    <option value="alphabetical">A-Z</option>
                                </TextField>
                                <IconButton onClick={() => setOrder(order === "asc" ? "desc" : "asc")} sx={{ bgcolor: '#fff', borderRadius: 2, border: '1px solid #E5E7EB' }}>
                                    <FilterListIcon sx={{ transform: order === 'desc' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* The Responsive Grid */}
                        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                            {visibleBookmarks.map((book) => (
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}
                                    key={book.id}
                                    sx={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <BookmarkCard
                                        book={book}
                                        setEdit={(b) => {
                                            setEditingBook(b);
                                            setTitelValue(b.title);
                                            setUrlValue(b.url);
                                            setOpen(true);
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

            {/* Dialog (Add/Edit) */}
            <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 5, p: 1, width: '100%', maxWidth: '450px' } }}>
                <DialogTitle sx={{ fontWeight: 800, fontSize: '1.4rem' }}>
                    {editingBook ? 'Edit Bookmark' : 'Create New Bookmark'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={3}>Fill in the details below to organize your link.</Typography>
                    <Stack spacing={2.5}>
                        <TextField fullWidth label="Link Title" placeholder="e.g. My Favorite Tool" variant="outlined" value={titelValue} onChange={e => setTitelValue(e.target.value)} />
                        <TextField fullWidth label="URL Address" placeholder="https://example.com" variant="outlined" value={urlValue} onChange={e => setUrlValue(e.target.value)} />
                        <TextField
                            fullWidth
                            label="Tags (Optional)"
                            placeholder="Work, Creative, News..."
                            variant="outlined"
                            value={tagsValue}
                            onChange={e => setTagsValue(e.target.value)}
                            helperText="Separate tags with commas"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><LabelOutlinedIcon fontSize="small" /></InputAdornment>,
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={handleClose} sx={{ color: '#666', fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#014746', borderRadius: 3, px: 4, fontWeight: 700, textTransform: 'none' }}>
                        {editingBook ? 'Update Bookmark' : 'Save Bookmark'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}