import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './DataAnalysis.css';
import { Route } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DataAnalysis() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/get-all-data');
            setCustomers(response.data);
        } catch (err) {
            setError('Error fetching customer data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

  
    const ratingCounts = {};
    customers.forEach(customer => {
        ratingCounts[customer.rating] = (ratingCounts[customer.rating] || 0) + 1;
    });


    const getChartData = () => {
        const ratingCounts = {};
        const monthlySales = {};
    
        customers.forEach(customer => {
        
            ratingCounts[customer.rating] = (ratingCounts[customer.rating] || 0) + 1;
    
       
            if (customer.date) {
                const date = new Date(customer.date);
                const month = date.toLocaleString('default', { month: 'short' }); 
                const total = parseFloat(customer.total.replace(/[^0-9.-]+/g, ""));
    
                if (!monthlySales[month]) monthlySales[month] = 0;
                monthlySales[month] += total || 0;
            }
        });
    
       
        const ratingLabels = Object.keys(ratingCounts).sort();
        const ratingData = Object.values(ratingCounts);
    
    
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const sortedMonths = monthOrder.filter(month => monthlySales[month]);
        const salesData = sortedMonths.map(month => monthlySales[month]);
    
        return {
            labels: [...ratingLabels, ...sortedMonths], 
            datasets: [
                {
                    label: 'Review Count per Rating',
                    data: [...ratingData, ...new Array(sortedMonths.length).fill(0)], 
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
               
            ]
        };
    };
    
    const getMonthlySalesChartData = () => {
        const monthlySales = {};
    
        customers.forEach(customer => {
            if (!customer.date) return;
    
            const date = new Date(customer.date);
            const month = date.toLocaleString('default', { month: 'short' }); 
    
            const total = parseFloat(customer.total.replace(/[^0-9.-]+/g, ""));
    
            if (!monthlySales[month]) monthlySales[month] = 0;
            monthlySales[month] += total || 0;
        });
    
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const sortedMonths = monthOrder.filter(month => monthlySales[month]); 
        const salesData = sortedMonths.map(month => monthlySales[month]);
    
        return {
            labels: sortedMonths,
            datasets: [
                {
                    label: 'Sales by Month',
                    data: salesData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        };
    };
    const getProductSalesData = () => {
        const productSales = {};
    
        customers.forEach(customer => {
            if (customer.productName) {
                const productName = customer.productName;
    
                const total = parseFloat(customer.total.replace(/[^0-9.-]+/g, ""));
                if (!productSales[productName]) productSales[productName] = 0;
                productSales[productName] += total || 0;
            }
        });
    
        const productLabels = Object.keys(productSales);
        const productSalesData = Object.values(productSales);
    
        return {
            labels: productLabels,
            datasets: [
                {
                    label: 'Sales by Product',
                    data: productSalesData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        };
    };
    

    return (
        
            
  <div className='DataAnalysis'>  
  <h1> Data Analysis</h1>
  <div className="chart-container">
    <Bar 
      data={getChartData()} 
      options={{ 
        responsive: true,
        maintainAspectRatio: false
      }}
      width={600}
      height={400}
    />
  </div>
  <div className="chart-container">
    <Bar 
      data={getProductSalesData()} 
      options={{ 
        responsive: true,
        maintainAspectRatio: false
      }}
      width={600}
      height={400}
    />
</div>


  <h2>Sales by Month</h2>
            <div className="chart-container">
                <Bar data={getMonthlySalesChartData()} options={{ responsive: true, maintainAspectRatio:false }}  width={600}
      height={400}/>
            </div> 

        
</div>
);
}

export default DataAnalysis;
