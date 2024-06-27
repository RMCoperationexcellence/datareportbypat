import SelectLocation from "./components/Select";
import SummaryTable from "./components/SummaryTable";
import ResultsDisplay from "./components/ResultsDisplay";
import { fetchPlantData, fetchSummaryAllDiv } from "./api";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function MainPage() {
  const [summaryData, setSummaryData] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [latestAssessmentDate, setLatestAssessmentDate] = useState("");
  const [searchData, setSearchData] = useState({
    division: 'all', // Default value for division
    department: '', // Default value for department
    sector: '', // Default value for sector
  });
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    setLoading(true); // Start loading
    // Fetch summary data when component mounts
    fetchSummaryAllDiv()
      .then((data) => {
        setSummaryData(data);
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching summary data:", error);
        setLoading(false); // Stop loading on error
      });
  }, []);

  const handleSearch = async (searchData) => {
    setSearchData(searchData); // Update searchData state with new values

    setLoading(true); // Start loading

    if (searchData.division === 'all') {
      // Fetch all summary data
      fetchSummaryAllDiv()
        .then((data) => {
          setSummaryData(data);
          setPlantData(null); // Clear plant data
          setLatestAssessmentDate(""); // Reset assessment date
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error("Error fetching summary data:", error);
          setSummaryData(null);
          setLoading(false); // Stop loading on error
        });
    } else {
      // Fetch plant-specific data based on search criteria
      fetchPlantData(searchData.division, searchData.department, searchData.sector, searchData.startDate, searchData.endDate)
        .then((data) => {
          if (data.length > 0) {
            setPlantData(data);
            setLatestAssessmentDate(data[0].AssessmentDate); // Assuming AssessmentDate is a property of plant data
            console.log("Plant Data", data);
          } else {
            setPlantData(null); // Clear plant data if no results
            setLatestAssessmentDate(""); // Reset assessment date if no results
          }
          setSummaryData(null); // Clear summary data
          setLoading(false); // Stop loading
        })
        .catch((error) => {
          console.error("Error fetching plant data:", error);
          setPlantData(null);
          setLatestAssessmentDate("");
          setSummaryData(null); // Clear summary data on error
          setLoading(false); // Stop loading on error
        });
    }
  };

  return (
    <div>
      <SelectLocation onSearch={handleSearch} />
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      )}
      {!loading && summaryData && <SummaryTable division="all" dataAllResults={summaryData} />}
      {!loading && plantData && (
        <ResultsDisplay
          dataResults={plantData}
          latestAssessmentDate={latestAssessmentDate}
        />
      )}
    </div>
  );
}

export default MainPage;
