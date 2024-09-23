import React, {useState, useEffect, SetStateAction} from "react"
import SelectSearch, {SelectedOptionValue, SelectedOption} from 'react-select-search';
import 'react-select-search/style.css'; 
import paw from '../../images/paw.png';
import { BASE_URL } from "../../../utils/urls";
import { FilterProps } from '../../../utils/interfaces';
import { RESULTS_PER_PAGE } from "../../../utils/constants";



export default function Filters({breeds, selectedBreeds, handleSelectionChange, getDogDetails, setCurrPage, setBreedFilterTags, getDogIds, setActiveFilterTags, minAge, setMinAge, maxAge, setMaxAge}: FilterProps){


   
    const [sortDirection, setSortDirection] = useState("")



    function setAges(e: React.ChangeEvent<HTMLInputElement>){
      const {name, value} = e.target
      if(Number(value) < 0) {
        alert("Please enter a valid age")
        return -1
      }
      if(name === "minAge") setMinAge(value)
      else if (name === "maxAge") setMaxAge(value)
    }


    async function handleFilters(){

    if(selectedBreeds.length === 0) {
        return getDogIds()
    }
    
    console.log('selected', selectedBreeds)
    setBreedFilterTags(selectedBreeds)
    setActiveFilterTags(true)

    setCurrPage(1)

    
        const selectedBreedsQuery = selectedBreeds.length > 1   ? [selectedBreeds[0], ...selectedBreeds].map(breed => `breeds=${encodeURIComponent(breed)}`).join('&') 
        : selectedBreeds

    let url = `${BASE_URL}/dogs/search?size=${RESULTS_PER_PAGE}&breeds=${selectedBreedsQuery}&sort=breed:asc`;

    if(sortDirection == "Descending") {
        url = `${BASE_URL}/dogs/search?size=${RESULTS_PER_PAGE}&breeds=${selectedBreedsQuery}&sort=breed:desc`
    }
    // Check for minAge and maxAge to adjust the query string
    if (minAge && maxAge) {
      url += `&ageMin=${minAge}&ageMax=${maxAge}`;
    } else if (minAge) {
      url += `&ageMin=${minAge}`;
    } else if (maxAge) {
      url += `&ageMax=${maxAge}`;
    }


    try{ 
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })


        const data = await res.json()
        getDogDetails(data.resultIds, data.next, data.total)
      
    }catch(err){
        console.log("Error in filter component", err)
    }

    }

    function handleSortDirection(e: any){
     
        setSortDirection(e.target.value)
       
        setTimeout(() => {
            const targetButton = document.getElementById('filterButton');
            if (targetButton) {
                targetButton.click(); // Trigger the button click
            }
        }, 0);
    }

    return(
      <>
        <div className="filterByBreed">
                            
        <img className="paw" src={paw} alt="Paw Icon" />
        <SelectSearch
            placeholder="Breed"
            options={breeds}
            search
            multiple
            value={selectedBreeds}
            onChange={handleSelectionChange}

        />  
    </div>

    <div className="filterByAge">
        <img className="paw" src={paw} alt="Paw Icon" />
        <label htmlFor="minAge">
        <input placeholder="Min Age" name="minAge" type="number" value={minAge} onChange={setAges} />
        </label>
        <span> &mdash; </span>
        <label htmlFor="maxAge">
        <input placeholder="Max Age" name="maxAge" type="number" value={maxAge} onChange={setAges}/>
        </label>
        
    </div>
    <div className="search-and-sort">
    <button className="filterSearch" id="filterButton" onClick={handleFilters} >Search</button>
        <label htmlFor="resultsOrders">
            <select onChange={handleSortDirection}>
                <option value="Ascending">
                    Ascending
                </option>
                <option value="Descending">
                    Descending 
                </option>
            </select>


        </label>
        </div>
    </>
    )
}