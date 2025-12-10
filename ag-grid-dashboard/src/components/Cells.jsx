import React from 'react';
import { Chip, Link as MUILink, LinearProgress, Box, Checkbox } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/** Status pill for isActive */
export const StatusPill = ({ value }) => {
  const active = Boolean(value);
  const theme = useTheme();
  return (
    <Chip
      label={active ? 'Active' : 'Inactive'}
      color={active ? 'success' : 'error'}
      size="small"
      variant={theme.palette.mode === 'light' ? 'filled' : 'outlined'}
    />
  );
};

/** Horizontal rating bar (0–5) */
export const RatingBar = ({ value }) => {
  const v = Number(value) || 0;
  const pct = Math.max(0, Math.min(5, v)) / 5 * 100;
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
      <Box sx={{ flex: 1 }}>
        <LinearProgress variant="determinate" value={pct} color="primary" sx={{ height: 8, borderRadius: 999 }} />
      </Box>
      <Box sx={{
        fontSize: '.8rem',
        color: isLight ? theme.palette.text.primary : '#cfe8ff',
        width: 32,
        textAlign: 'right',
        fontWeight: 600,
      }}>
        {v.toFixed(1)}
      </Box>
    </Box>
  );
};

/** Email as a mailto: link */
export const MailLink = ({ value }) => {
  const theme = useTheme();
  return (
    <MUILink
      href={`mailto:${value}`}
      underline="hover"
      sx={{ color: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.light }}
    >
      {value}
    </MUILink>
  );
};

/** Department badge (colored by dept) */
export const DeptBadge = ({ value }) => {
  const k = (value || '').toLowerCase();
  const color = {
    engineering: '#0078d4',
    marketing:  '#9c27b0',
    sales:      '#ff6f00',
    hr:         '#2e7d32',
    finance:    '#455a64',
  }[k] ?? '#616161';
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        color: isLight ? '#fff' : '#fff',
        backgroundColor: color,
      }}
    />
  );
};

/** Comma-separated skills as chips */
export const SkillsChips = ({ value }) => {
  const skills = Array.isArray(value) ? value : String(value || '').split(/[ ,]+/).filter(Boolean);
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .5 }}>
      {skills.map((s, i) => (
        <Chip
          key={`${s}-${i}`}
          label={s}
          size="small"
          variant={theme.palette.mode === 'light' ? 'filled' : 'outlined'}
          color={theme.palette.mode === 'light' ? 'default' : 'primary'}
        />
      ))}
    </Box>
  );
};

/** Blue-tick selection checkbox for rows */
export const SelectionCheckbox = (params) => {
  const theme = useTheme();
  const initial = params.node?.isSelected?.() ?? false;
  const [checked, setChecked] = React.useState(initial);
  const onChange = (e) => {
    const isChecked = e.target.checked;
    params.node?.setSelected?.(isChecked);
    setChecked(isChecked);
  };
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      size="small"
      sx={{ color: theme.palette.primary.main, '&.Mui-checked': { color: theme.palette.primary.main } }}
    />
  );
};
