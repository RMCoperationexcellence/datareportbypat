// SummaryTable.jsx
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

function SummaryTable({ division, dataAllResults }) {
  return (
    <>
      {division === "all" && dataAllResults.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center">
            สรุปผลการตรวจทุกกิจการ
          </Typography>
          <TableContainer>
            <Table>
              <TableHead style={{ backgroundColor: "#01BAF2" }}>
                <TableRow>
                  <TableCell>กิจการ</TableCell>
                  <TableCell>จำนวนโรงงานทั้งหมด</TableCell>
                  <TableCell>%ผ่าน ver</TableCell>
                  <TableCell>ผ่าน</TableCell>
                  <TableCell>ไม่ผ่าน</TableCell>
                  <TableCell>ยังไม่ตรวจ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataAllResults.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.NAME}</TableCell>
                    <TableCell>{item.PlantTotal}</TableCell>
                    <TableCell>{Math.round(item.percentPass)}</TableCell>
                    <TableCell>{item.PassingPlantCount}</TableCell>
                    <TableCell>
                      {item.PlantTotal - item.PassingPlantCount}
                    </TableCell>
                    <TableCell>
                      {item.PlantTotal - item.PlantWithDataCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </>
  );
}

export default SummaryTable;
