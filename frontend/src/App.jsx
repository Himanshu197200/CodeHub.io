import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Paper,
  Stack,
  Chip,
  Button,
} from '@mui/material'
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  BugReport as BugReportIcon,
  History as HistoryIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

const drawerWidth = 240

function App() {
  const [mode, setMode] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [leaders, setLeaders] = useState([])

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

  const toggleColorMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))
  const handleDrawerToggle = () => setMobileOpen((o) => !o)

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon /> },
    { label: 'Repositories', icon: <FolderIcon /> },
    { label: 'Issues', icon: <BugReportIcon /> },
    { label: 'Commits', icon: <HistoryIcon /> },
    { label: 'Stars', icon: <StarIcon /> },
    { label: 'Leaderboard', icon: <EmojiEventsIcon /> },
    { label: 'Profile', icon: <PersonIcon /> },
  ]

  const drawer = (
    <Box sx={{ height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          CodeHub
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItemButton key={item.label} selected={item.label === 'Dashboard'}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    fetch(`${api}/api/leaderboard`)
      .then((r) => r.json())
      .then((d) => setLeaders(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setLeaders([]))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <IconButton color="inherit" onClick={toggleColorMode} aria-label="toggle theme">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Repositories
                </Typography>
                <Typography variant="h4">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Commits (30d)
                </Typography>
                <Typography variant="h4">154</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Open Issues
                </Typography>
                <Typography variant="h4">8</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stars
                </Typography>
                <Typography variant="h4">43</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6">Recent Activity</Typography>
                  <Button size="small">View all</Button>
                </Stack>
                <Stack spacing={1}>
                  <ActivityItem who="you" what="pushed 3 commits" where="codehub/frontend" when="2h ago" />
                  <ActivityItem who="alice" what="opened issue #42" where="server" when="5h ago" />
                  <ActivityItem who="bob" what="starred" where="codehub" when="yesterday" />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Quick Actions
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip icon={<FolderIcon />} label="New Repository" variant="outlined" />
                  <Chip icon={<HistoryIcon />} label="New Commit" variant="outlined" />
                  <Chip icon={<BugReportIcon />} label="New Issue" variant="outlined" />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Leaderboard
                </Typography>
                <Stack spacing={1}>
                  {leaders.length === 0 && (
                    <Typography variant="body2" color="text.secondary">No data</Typography>
                  )}
                  {leaders.slice(0, 5).map((u, idx) => (
                    <Stack key={u.user + idx} direction="row" alignItems="center" spacing={1}>
                      <EmojiEventsIcon fontSize="small" />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>{u.user}</Typography>
                      <Chip size="small" label={`${u.points} pts`} />
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Your Repositories
            </Typography>
            <RepoTable />
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function ActivityItem({ who, what, where, when }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <PersonIcon fontSize="small" />
      <Typography variant="body2">
        <strong>{who}</strong> {what} in <strong>{where}</strong>
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="caption" color="text.secondary">
        {when}
      </Typography>
    </Stack>
  )
}

function RepoTable() {
  const rows = [
    { name: 'codehub', stars: 23, issues: 2, updated: '2h ago' },
    { name: 'server', stars: 14, issues: 1, updated: '5h ago' },
    { name: 'frontend', stars: 6, issues: 0, updated: 'yesterday' },
  ]
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
        <Box component="thead" sx={{ '& th': { textAlign: 'left', p: 1, borderBottom: 1, borderColor: 'divider' } }}>
          <Box component="tr">
            <Box component="th">Name</Box>
            <Box component="th">Stars</Box>
            <Box component="th">Open Issues</Box>
            <Box component="th">Last Updated</Box>
          </Box>
        </Box>
        <Box component="tbody" sx={{ '& td': { p: 1, borderBottom: 1, borderColor: 'divider' } }}>
          {rows.map((r) => (
            <Box component="tr" key={r.name}>
              <Box component="td">
                <Stack direction="row" spacing={1} alignItems="center">
                  <FolderIcon fontSize="small" />
                  <Typography variant="body2">{r.name}</Typography>
                </Stack>
              </Box>
              <Box component="td">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <StarIcon fontSize="small" />
                  <Typography variant="body2">{r.stars}</Typography>
                </Stack>
              </Box>
              <Box component="td">{r.issues}</Box>
              <Box component="td">{r.updated}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default App