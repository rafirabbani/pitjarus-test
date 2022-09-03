import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import _ from 'lodash';



function App() {
  const [city, setCity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:10000/pitjarus-api/city')
    .then(res => res.json())
    .then(response => {
      setCity(response.data);
      setIsLoading(false);
    })
    .catch(error => console.log(error));
    
  }, []);

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const handleChangeCity = (event) => {
    setSelectedCity(event);
  };

  const handleFind = async () => {
    if (selectedCity.length < 1) {
      alert('please select city')
    }
    else {
      const _selectedCityId = selectedCity.map(data => data.value);
      const endPoint = 'http://localhost:10000/pitjarus-api/report?'
      let query = '';
      if (_selectedCityId.length === 1) {
        query += `areaId=${_selectedCityId[0]}&areaId=${_selectedCityId[0]}`
      }
      else {
        query += _selectedCityId.map((data, index) => {
          if (index === 0) {
            return `areaId=${data}`;
          }
          else {
            return `&areaId=${data}`;
          }
        }).join('');
      }
      try {
        const apiData = await fetch(endPoint + query);
        const response = await apiData.json();
        setReportData(response.data);
      }
      catch(err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="App">
      <div className='filterContainer'>
        <div className='dropDownContainer'>
          <ReactSelect
            options={!isLoading && city.map(data => ({value: data.area_id, label: data.area_name}))}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              Option
            }}
            onChange={e => handleChangeCity(e)}
            allowSelectAll={true}
            value={selectedCity}
            placeholder={"Select City"}
            
          />
        </div>
        <div className='dropDownContainer'>
          <DatePicker placeholderText='Select Date From'/>
        </div>
        <div className='dropDownContainer'>
          <DatePicker placeholderText='Select Date To'/>
        </div>
        <div className='dropDownContainer'>
          <button onClick={handleFind}>FIND</button>
        </div>
      </div>
      <div className='tableContainer'>
            <ul>
              {!_.isEmpty(reportData) && console.log(reportData)}
            </ul>
      </div>  
    </div>
  );
}

export default App;
