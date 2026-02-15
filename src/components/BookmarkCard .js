import { useContext, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from "@mui/icons-material/PushPin";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Divider from "@mui/material/Divider";
import { DispatchContext } from "../Context/BookMarkerContext";

export default function BookmarkCard({ book, setEdit }) {
    const dispatch = useContext(DispatchContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = Boolean(anchorEl);
    const handleOpenLink = () => {
        const formattedUrl = book.url.startsWith('http') ? book.url : `https://${book.url}`;
        window.open(formattedUrl, "_blank", "noopener,noreferrer");
    };

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
        });
    }

    // ================= Actions =================

    function handleDelete() {
        dispatch({ type: "DELETE_BOOKMARK", payload: book.id });
        setAnchorEl(null);
    }

    function handleArchiveToggle() {
        dispatch({ type: "TOGGLE_ARCHIVE", payload: book.id });
        setAnchorEl(null);
    }

    function handlePin() {
        dispatch({ type: "TOGGLE_PINNED", payload: book.id });
        setAnchorEl(null);
    }

    function handleUnpinClick() {
        dispatch({ type: "TOGGLE_PINNED", payload: book.id });
    }

    // ================= UI =================

    return (
        <Card
            elevation={0}
            sx={{
                width: { xs: 390, sm: 250, lg: 300 },
                height: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                border: "1px solid #E5E7EB",
                position: "relative",
                transition: "0.2s",
                "&:hover": { boxShadow: 3 }
            }}
        >
            <CardContent>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Avatar
                            src={`https://www.google.com/s2/favicons?domain=${book.url}&sz=64`}
                            variant="rounded"
                            sx={{ width: 25, height: 25, p: 0.5 }}
                        />
                        <Typography fontWeight={600}
                            onClick={handleOpenLink}
                            variant="subtitle1"
                            noWrap
                            sx={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: 'pointer'
                            }}>
                            {book.title}
                        </Typography>
                    </Box>

                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '4px',
                            '&:hover': {
                                backgroundColor: '#f9fafb'
                            },
                        }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                {/* URL */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                    {book.url}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                    {book.tags && book.tags.length > 0 ? (
                        book.tags.map((tag, index) => (
                            <Box
                                key={index}
                                sx={{
                                    bgcolor: '#F0F7F7', color: '#014746', px: 1.2, py: 0.4,
                                    borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700,
                                    border: '1px solid #D1E5E4'
                                }}
                            >
                                #{tag}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="caption" sx={{ color: '#BDC3C7', fontStyle: 'italic' }}>
                            No tags added
                        </Typography>
                    )}
                </Box>
            </CardContent>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={() => {
                        setEdit(book);
                        setAnchorEl(null);
                    }}
                >
                    <EditOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
                    Edit
                </MenuItem>

                {!book.isPinned && (
                    <MenuItem onClick={handlePin}>
                        <PushPinIcon fontSize="small" style={{ marginRight: 8 }} />
                        Pin
                    </MenuItem>
                )}

                <MenuItem onClick={handleArchiveToggle}>
                    {book.isArchived ? (
                        <>
                            <UnarchiveOutlinedIcon
                                fontSize="small"
                                style={{ marginRight: 8 }}
                            />
                            Unarchive
                        </>
                    ) : (
                        <>
                            <ArchiveOutlinedIcon
                                fontSize="small"
                                style={{ marginRight: 8 }}
                            />
                            Archive
                        </>
                    )}
                </MenuItem>

                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
                    Delete
                </MenuItem>
            </Menu>
            <Divider sx={{
                borderColor: "#E5E7EB",
                position: "absolute",
                bottom: 45,
                left: 0,
                width: "100%"
            }} />
            <Box
                sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                    minHeight: "25px"
                }}
            >
                {/* Date */}
                <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">{formatDate(book.createdAt)}</Typography>
                </Box>

                {/* Pin Icon */}
                {book.isPinned && (
                    <IconButton
                        size="small"
                        onClick={handleUnpinClick}
                        sx={{
                            background: "#F3F4F6",
                            "&:hover": { background: "#E5E7EB" }
                        }}
                    >
                        <PushPinIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                )}
            </Box>

        </Card>
    );
}
