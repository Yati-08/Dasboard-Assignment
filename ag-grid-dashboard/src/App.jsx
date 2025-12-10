import  { useMemo, useRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './styles.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, TextField, Select, MenuItem, Button, Stack, Badge, IconButton, FormControl, InputLabel } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import data from './data/employees.json'; 
import { StatusPill, RatingBar, MailLink, DeptBadge, SkillsChips, SelectionCheckbox } from './components/Cells';

// Register AG Grid Community modules (v33+ requires module registration)
ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {
  const gridRef = useRef(null);
  const [quickFilter, setQuickFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [selectedCount, setSelectedCount] = useState(0);
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') === 'light' ? 'light' : 'dark');
  const rows = Array.isArray(data) ? data : [];

 

  const columnDefs = useMemo(() => [
    {
      headerName: '',
      width: 60,
      pinned: 'left',
      sortable: false,
      filter: false,
      cellRenderer: SelectionCheckbox,
      suppressHeaderKeyboardEvent: true,
      headerComponentParams: { },
    },
    {
      headerName: '#',
      field: 'id',
      width: 90,
      pinned: 'left',
   
    },
    {
      headerName: 'Name',
      valueGetter: p => `${p.data.firstName} ${p.data.lastName}`,
      sortable: true,
      filter: 'agTextColumnFilter',
      minWidth: 170,
    },
    {
      headerName: 'Email',
      field: 'email',
      cellRenderer: MailLink,
      minWidth: 220,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Department',
      field: 'department',
      cellRenderer: DeptBadge,
      filter: 'agTextColumnFilter',
      minWidth: 150,
    },
    { headerName: 'Position', field: 'position', filter: 'agTextColumnFilter', minWidth: 180 },
    {
      headerName: 'Salary',
      field: 'salary',
      filter: 'agNumberColumnFilter',
      valueFormatter: p => (p.value != null ? p.value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : ''),
      cellClass: 'mono',
      minWidth: 140,
    },
    { headerName: 'Hire Date', field: 'hireDate', filter: 'agDateColumnFilter', minWidth: 140 },
    { headerName: 'Age', field: 'age', filter: 'agNumberColumnFilter', width: 110 },
    { headerName: 'Location', field: 'location', filter: 'agTextColumnFilter', minWidth: 140 },
    {
      headerName: 'Rating',
      field: 'performanceRating',
      cellRenderer: RatingBar,
      filter: 'agNumberColumnFilter',
      minWidth: 180,
      
      sortable: true,
    },
    { headerName: 'Projects', field: 'projectsCompleted', filter: 'agNumberColumnFilter', sortable: true },
    {
      headerName: 'Status',
      field: 'isActive',
      cellRenderer: StatusPill,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Skills',
      field: 'skills',
      cellRenderer: SkillsChips,
      filter: 'agTextColumnFilter',
      minWidth: 220,
      autoHeight: true,
    },
    { headerName: 'Manager', field: 'manager', filter: 'agTextColumnFilter', minWidth: 160 },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
    wrapText: true,
    autoHeight: true,
  }), []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#0078d4' },
      ...(mode === 'dark' ? { background: { default: '#0f172a', paper: '#111827' } } : {})
    },
    typography: { fontSize: 13 },
  }), [mode]);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  }, []);

  

  const onQuickFilterChange = useCallback((e) => {
    const v = e.target.value;
    setQuickFilter(v);
    gridRef.current?.api.setGridOption('quickFilterText', v);
  }, []);

  const onExport = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({ fileName: 'employees.csv' });
  }, []);

  const onPageSizeChange = useCallback((e) => {
    const size = Number(e.target.value);
    setPageSize(size);
    // v33+ prefers setGridOption for updating options at runtime
    gridRef.current?.api.setGridOption('paginationPageSize', size);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const count = gridRef.current?.api.getSelectedRows().length ?? 0;
    setSelectedCount(count);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="page">
      <header className="page__header">
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} className="title">
          <Box>
            <Typography variant="h6" component="h1">People Dashboard</Typography>
            <Typography variant="body2" className="subtitle">Client-side table using MUI and AG Grid</Typography>
          </Box>
          <IconButton aria-label="Toggle theme" onClick={toggleMode} color="primary">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" className="toolbar">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Quick search (name, dept, skills...)"
            value={quickFilter}
            onChange={onQuickFilterChange}
            sx={{
              minWidth: 260,
              '& .MuiInputBase-input': {
                      color: '#fff',
                '&::placeholder': {
                        color: mode === 'light' ? 'white' : 'white',
                  opacity: 1,
                },
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'light' ? '#cbd5e1' : '#cbd5e1' },
                    bgcolor: mode === 'dark' ? '#0b1220' : '#0b1220',
            }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel sx={{ color: '#fff' }} id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              size="small"
              value={pageSize}
              label="Rows per page"
              onChange={onPageSizeChange}
              sx={{
                '& .MuiSelect-select': { color: '#fff' },
                '& .MuiSelect-icon': { color: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: mode === 'light' ? '#cbd5e1' : '#cbd5e1' },
                bgcolor: mode === 'dark' ? '#0b1220' : '#0b1220',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: mode === 'light' ? '#0b1220' : '#0b1220',
                    color: '#fff',
                  }
                }
              }}
            >
              <MenuItem value={10}>10 / page</MenuItem>
              <MenuItem value={25}>25 / page</MenuItem>
              <MenuItem value={50}>50 / page</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={onExport}
            sx={{
              color: '#fff',
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              }
            }}
          >
            Export CSV
          </Button>
          <Badge badgeContent={selectedCount} color="primary">
            <Typography variant="body2" className="sel">Selected</Typography>
          </Badge>
        </Stack>
      </header>

      <main className="page__content">
        <div
          className={`ag-theme-quartz grid ${mode === 'light' ? 'mui-light' : ''}`}
          style={{
            height: '70vh',
            width: '100%',
            // Dynamic CSS vars mapped from MUI theme
            '--ag-background-color': mode === 'light' ? theme.palette.background.default : '#0b1220',
            '--ag-header-background-color': mode === 'light' ? theme.palette.background.paper : '#0f172a',
            '--ag-header-foreground-color': theme.palette.text.primary,
            '--ag-foreground-color': theme.palette.text.primary,
            '--ag-border-color': mode === 'light' ? '#e5e7eb' : '#1f2937',
            '--ag-row-hover-color': mode === 'light' ? '#eef3ff' : '#111d34',
            '--ag-selected-row-background-color': mode === 'light' ? '#e6f2ff' : '#0e2448',
            '--ag-font-size': '13px',
          }}
        >
          {rows.length === 0 && (
            <div className="empty-state">
              No data available. Check JSON import and console.
            </div>
          )}
          <AgGridReact
            ref={gridRef}
            rowData={rows}                     // 20 records parsed from your docx [1](blob:https://outlook.office.com/99880331-1d85-4448-bbc4-8d5fdad8e1bd)
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            pagination={true}
            paginationPageSize={pageSize}
            onSelectionChanged={onSelectionChanged}
            getRowHeight={(params) => {
              const skills = params.data?.skills;
              if (Array.isArray(skills) && skills.length) {
                return 72;
              }
              return undefined;
            }}
            onFirstDataRendered={() => {
              const api = gridRef.current?.api;
              if (api) {
                api.sizeColumnsToFit();
              }
            }}
          />
        </div>
      </main>
      </div>
    </ThemeProvider>
  );
}
