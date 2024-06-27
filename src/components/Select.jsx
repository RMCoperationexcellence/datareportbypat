import { useState, useEffect } from "react";
import { fetchSearchData } from "../api";
import {
  Grid,
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Divider,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
// import 'dayjs/locale/th'; // หากต้องการใช้งาน locale ภาษาไทย

export default function SelectLocation({ onSearch }) {
  const [division, setDivision] = useState("all");
  const [department, setDepartment] = useState("");
  const [sector, setSector] = useState("");
  const [searchdata, setSearchdata] = useState([]);
  const [searchdata1, setSearchdata1] = useState([]);
  const [searchdata2, setSearchdata2] = useState([]);
  const defaultStartDate = dayjs().subtract(1, 'month').startOf('month');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(null);
  

  const handleChange = async (event) => {
    const selectedDivision = event.target.value;
    setDivision(selectedDivision);
    if (selectedDivision === "all") {
      setSearchdata1([]);
      setSearchdata2([]);
      setDepartment("");
      setSector("");
    } else {
      const result = await fetchSearchData(selectedDivision);
      setSearchdata1(result);
      setDepartment("");
      setSector("");
    }
  };

  const handleDepartmentChange = async (event) => {
    const selectedDepartment = event.target.value;
    setDepartment(selectedDepartment);
    if (selectedDepartment) {
      const result = await fetchSearchData(division, selectedDepartment);
      setSearchdata2(result);
      setSector("");
    } else {
      setSearchdata2([]);
      setSector("");
    }
  };

  const handleSearch = async () => {
    const searchData = {
      division: division,
      department: department,
      sector: sector,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.endOf("month").format("YYYY-MM-DD") : null,
    };
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleDateChange = (newDate) => {
    if (newDate) {
      const start = newDate.startOf("month");
      const end = newDate.endOf("month");
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };
  console.log('s',startDate);
  console.log('e',endDate);

  useEffect(() => {
    const initializeData = async () => {
      const result = await fetchSearchData();
      setSearchdata(result);
    };
    initializeData();
  }, []);

  return (
    <div>
      <Box boxShadow={2} p={2} mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="division-label">กิจการ</InputLabel>
              <Select
                labelId="division-label"
                value={division}
                onChange={handleChange}
                label="กิจการ"
              >
                <MenuItem value="all">
                  <em>All</em>
                </MenuItem>
                {searchdata.map((item) => (
                  <MenuItem key={item.DIVISION_NO} value={item.DIVISION_NO}>
                    {item.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="department-label">ภาค</InputLabel>
              <Select
                labelId="department-label"
                value={department}
                onChange={handleDepartmentChange}
                label="ภาค"
                disabled={division === "all"}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {searchdata1.map((item) => (
                  <MenuItem key={item.DEPT_NO} value={item.DEPT_NO}>
                    {item.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="sector-label">แผนก</InputLabel>
              <Select
                labelId="sector-label"
                value={sector}
                onChange={(event) => setSector(event.target.value)}
                label="แผนก"
                disabled={!department}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {searchdata2.map((item) => (
                  <MenuItem key={item.SECT_NO} value={item.SECT_NO}>
                    {item.NAME}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={"เลือกเดือนและปี"}
                views={["month", "year"]}
                value={startDate}
                onChange={handleDateChange}
                allowKeyboardControl={false}
                disableFuture 
              />
            </LocalizationProvider>
          </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              style={{ color: "black", backgroundColor: "#01BAF2" }}
              onClick={handleSearch}
            >
              ค้นหา
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
