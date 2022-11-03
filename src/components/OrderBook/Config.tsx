import { MenuItem, Paper, Select, Typography } from "@mui/material";
import { PREC_LEVEL } from "../../hooks/useBookSocket";

interface Props {
  onChangePrecLevel: (level: PREC_LEVEL) => void;
  precLevel: PREC_LEVEL
}

function Config({ onChangePrecLevel, precLevel }: Props) {
  return (
    <Paper className="Config">
      <Typography>Prec Level</Typography>
      <Select
        labelId="demo-simple-select-label"
        value={precLevel}
        label="Prec Level"
        onChange={(e) => onChangePrecLevel(e.target.value as PREC_LEVEL)}
      >
        {[0, 1, 2, 3, 4, 5].map((level) => (
          <MenuItem key={level} value={level}>
            P{level}
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
}

export default Config;
