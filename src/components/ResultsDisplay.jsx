// ResultsDisplay.jsx
import {
  Grid,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Chip,
} from "@mui/material";

export default function ResultsDisplay({ dataResults, latestAssessmentDate, }) {
  const groupByPlantNo = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.PLANT_NO]) {
        acc[item.PLANT_NO] = [];
      }
      acc[item.PLANT_NO].push(item);
      return acc;
    }, {});
  };

  const calculateOverallPercentage = (data) => {
    const totalActualScore = data.reduce(
      (acc, item) => acc + item.ActualScore,
      0
    );
    const totalMaxScore = data.reduce((acc, item) => acc + item.TotalScore, 0);
    const totalMustPass = data.reduce(
      (acc, item) => acc + item.MustPassCount,
      0
    );
    const overallPercentage = (
      (totalActualScore / totalMaxScore) *
      100
    ).toFixed(0);
    return {
      percentage: overallPercentage,
      status: overallPercentage >= 80 ? "ผ่าน" : "ไม่ผ่าน",
      CountMustpass: totalMustPass,
    };
  };

  const groupedData = groupByPlantNo(dataResults);

  return (
    <div>
      {Object.keys(groupedData).map((plantNo, index) => {
        const overallResult = calculateOverallPercentage(groupedData[plantNo]);
        return (
          <Grid item xs={12} key={index} style={{ marginBottom: "10px" }}>
            <Box
              sx={{
                backgroundColor: index % 2 === 0 ? "#01BAF2" : "#A5D8EB",
                border: "2px solid black",
              }}
            >
              <Typography sx={{ fontSize: "23px" }}>
                โรงงาน {groupedData[plantNo][0].plant_name}
              </Typography>
              <Typography sx={{ fontSize: "23px" }}>
                สังกัด {groupedData[plantNo][0].sector_name} / {groupedData[plantNo][0].deprtmant_name}
              </Typography>
              <Grid
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="subtitle1">
                  ผลการตรวจประเมินล่าสุด
                </Typography>
                <Typography variant="subtitle1">
                  {latestAssessmentDate}
                </Typography>
              </Grid>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{ mt: 2, mb: 2 }}
              >
                จำนวนข้อแดง:{" "}
                <strong style={{ fontSize: "23px" }}>
                  {overallResult.CountMustpass}
                </strong>
                {`,เปอร์เซ็นที่ได้: `}
                <strong style={{ fontSize: "23px" }}>
                  {overallResult.percentage}%
                </strong>
                {""}
                ,สรุป:
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "23px",
                    color:
                      overallResult.status === "ผ่าน" ? "green" : "red",
                  }}
                >
                  {overallResult.status}
                </span>
              </Typography>
              <TableContainer
                sx={{
                  backgroundColor:
                    index % 2 === 0 ? "#01BAF2" : "#A5D8EB",
                }}
              >
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: "2px solid black",
                      borderTop: "2px solid black",
                    }}
                  >
                    <TableRow>
                      <TableCell>เรื่อง</TableCell>
                      <TableCell
                        sx={{
                          borderLeft: "2px solid black",
                          borderRight: "2px solid black",
                        }}
                      >
                        จุดแดง
                      </TableCell>
                      <TableCell>%ที่ได้</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedData[plantNo].map((item, itemIndex) => (
                      <TableRow
                        key={itemIndex}
                        sx={{ borderTop: "2px solid black" }}
                      >
                        <TableCell>{item.group_name}</TableCell>
                        <TableCell
                          sx={{
                            borderLeft: "2px solid black",
                            borderRight: "2px solid black",
                            color:
                              item.MustPassCount === 0
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {item.MustPassCount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${(
                              (item.ActualScore / item.TotalScore) *
                              100
                            ).toFixed(0)}%`}
                            title={`${item.ActualScore}/${item.TotalScore}`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        );
      })}
    </div>
  );
}
