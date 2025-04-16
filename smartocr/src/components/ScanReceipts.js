import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ScanReceipts.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ChartDataLabels);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ScanReceipts() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [folderPath, setFolderPath] = useState('');
    const [scanning, setScanning] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [sentimentFilter, setSentimentFilter] = useState('All');

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

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to delete all records?")) {
            try {
                await axios.delete('http://localhost:8080/api/deleteAll');
                setCustomers([]);
            } catch (err) {
                setError('Error deleting data: ' + err.message);
            }
        }
    };

    const handleScan = async () => {
        setScanning(true);
        try {
            await axios.get(`http://localhost:8080/api/process-folder?folderPath=${encodeURIComponent(folderPath)}`);
            await fetchCustomers();
        } catch (err) {
            setError('Error scanning documents: ' + err.message);
        } finally {
            setScanning(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete/${id}`);
            await fetchCustomers();
        } catch (err) {
            setError('Error deleting customer data: ' + err.message);
        }
    };

    const handleEdit = (customer) => {
        setEditingId(customer.id);
        setEditForm({ ...customer });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/update/${editingId}`, editForm);
            await fetchCustomers();
            setEditingId(null);
        } catch (err) {
            setError('Error updating customer data: ' + err.message);
        }
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const getRatingClass = (rating) => {
        if (rating >= 4.5) return { classification: 'Excellent', color: 'green' };
        if (rating >= 3.5) return { classification: 'Good', color: 'orange' };
        return { classification: 'Bad', color: 'red' };
    };

    const getSentimentClass = (score) => {
        if (score >= 0.6) return { classification: 'Positive', color: 'green' };
        if (score <= 0.2) return { classification: 'Negative', color: 'red' };
        return { classification: 'Neutral', color: 'orange' };
    };

    const getFirstTwoWords = (text) => {
        if (!text) return '';
        return text.split(' ').slice(0, 2).join(' ');
    };

    const filteredCustomers = customers.filter(customer => {
        const sentiment = getSentimentClass(customer.sentimentalAnalysis).classification;
        return sentimentFilter === 'All' || sentiment === sentimentFilter;
    });


    const getProductSalesData = () => {
        const productSales = {};
        const productCounts = {};
    
        customers.forEach(customer => {
            if (customer.productName) {
                const productName = customer.productName;
                const total = parseFloat(customer.total.replace(/[^0-9.-]+/g, ""));
    
                if (!productSales[productName]) {
                    productSales[productName] = 0;
                    productCounts[productName] = 0;
                }
    
                productSales[productName] += total || 0;
                productCounts[productName] += 1;
            }
        });
    
        const productLabels = Object.keys(productSales);
        const productSalesData = productLabels.map(label => productSales[label]);
        const productCountData = productLabels.map(label => productCounts[label]);
    
        return {
            labels: productLabels,
            datasets: [
                {
                    label: 'Gross Sales',
                    data: productSalesData,
                    // label: 'Count',
                    // data:productCountData,
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    datalabels: {
                        anchor: 'end',
                        align: 'start',
                        formatter: (value, context) => {
                            const index = context.dataIndex;
                            const sales = value.toFixed(2);
                            const count = productCountData[index];
                            return `${count}`;
                        },
                        color: '#000',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            ]
        };
    };
    

    const extractSentimentScore = (sentimentStr) => {
        if (!sentimentStr) return 0;
        const match = sentimentStr.match(/\(([\d.-]+)\)/); // Extract decimal/negative number from parentheses
        return match ? parseFloat(match[1]) : 0;
    };
    

 
    const ratingCounts = {};
    customers.forEach(customer => {
        ratingCounts[customer.rating] = (ratingCounts[customer.rating] || 0) + 1;
    });


    // const getChartData = () => {
    //     const ratingCounts = {};
    //     const monthlySales = {};
    
    //     customers.forEach(customer => {
        
    //         ratingCounts[customer.rating] = (ratingCounts[customer.rating] || 0) + 1;
    
    
    //         if (customer.date) {
    //             const date = new Date(customer.date);
    //             const month = date.toLocaleString('default', { month: 'short' }); 
    //             const total = parseFloat(customer.total.replace(/[^0-9.-]+/g, ""));
    
    //             if (!monthlySales[month]) monthlySales[month] = 0;
    //             monthlySales[month] += total || 0;
    //         }
    //     });
    
    
    //     const ratingLabels = Object.keys(ratingCounts).sort();
    //     const ratingData = Object.values(ratingCounts);
    
    
    //     const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //     const sortedMonths = monthOrder.filter(month => monthlySales[month]);
    //     const salesData = sortedMonths.map(month => monthlySales[month]);
    
    //     return {
    //         labels: [...ratingLabels, ...sortedMonths], 
    //         datasets: [
    //             // {
    //             //     label: 'Review Count per Rating',
    //             //     data: [...ratingData, ...new Array(sortedMonths.length).fill(0)], 
    //             //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //             //     borderColor: 'rgba(75, 192, 192, 1)',
    //             //     borderWidth: 1
    //             // },
    //             {
    //                 label: 'Sales by Month',
    //                 data: [...new Array(ratingLabels.length).fill(0), ...salesData], 
    //                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //                 borderColor: 'rgba(255, 99, 132, 1)',
    //                 borderWidth: 1
    //             }
    //         ]
    //     };
    // };
    
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
    return (
        <div className="scan-receipts">
            <h1>Scan Receipts</h1>

            <div className="scan-container">
                <input
                    type="text"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    placeholder="Enter folder path"
                />
                <button onClick={handleScan} disabled={scanning || !folderPath}>
                    {scanning ? <span className="loading-dots">Scanning</span> : <><FaSearch /> Scan Documents</>}
                </button>
                <button onClick={handleClearAll} className="clear-all-btn"><FaTrash /> Clear All Data</button>
            </div>

            {error && (
                <div className="toast error">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}><FaTimes /></button>
                </div>
            )}

            
            <h2>Customer Data Analysis</h2>
                <div className="charts-wrapper">
    <div className="chart-container">
        <Bar 
        data={getMonthlySalesChartData()} 
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
    </div>


                {/* <h2>Sales by Month</h2>
                <div className="chart-container">
                    <Bar data={getMonthlySalesChartData()} options={{ responsive: true }} />
                </div> */}

<div className="filter-container">
                <label htmlFor="sentimentFilter">Filter by Sentiment:</label>
                <select
                    id="sentimentFilter"
                    value={sentimentFilter}
                    onChange={(e) => setSentimentFilter(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                </select>
            </div>
            <h2>Customer Data</h2>
            {loading ? (
                <div className="loading-spinner"></div>
            ) : filteredCustomers.length === 0 ? (
                <div className="no-data">
                    <p>No matching customer data available.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="customer-table">
                        <thead>
                            <tr>
                                <th>Receipt Number</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Product</th>
                                <th>Tax</th>
                                <th>Total Amount</th>
                                <th>Rating</th>
                                <th>Classification</th>
                                <th>Sentimental Scores</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.map((customer) => {
    const { color } = getRatingClass(customer.rating);
    const sentiment = getSentimentClass(customer.sentimentalAnalysis);
    const isEditing = editingId === customer.id;

    return (
        <tr key={customer.id}>
            <td>{isEditing ? <input name="receiptNo" value={editForm.receiptNo} onChange={handleChange} /> : customer.receiptNo}</td>
            <td>{isEditing ? <input name="name" value={editForm.name} onChange={handleChange} /> : customer.name}</td>
            <td>{isEditing ? <input name="date" value={editForm.date} onChange={handleChange} /> : customer.date}</td>
            <td>{isEditing ? <input name="location" value={editForm.location} onChange={handleChange} /> : customer.location}</td>
            <td>{isEditing ? <input name="productName" value={editForm.productName} onChange={handleChange} /> : getFirstTwoWords(customer.productName)}</td>
            <td>{isEditing ? <input name="tax" value={editForm.tax} onChange={handleChange} /> : customer.tax}</td>
            <td>{isEditing ? <input name="total" value={editForm.total} onChange={handleChange} /> : customer.total}</td>
            <td style={{ color }}>{customer.rating}</td>
            <td style={{ color: sentiment.color }}>{sentiment.classification}</td>
            <td>{customer.sentimentalAnalysis?.toFixed(2)}</td>
            <td>
                {isEditing ? (
                    <>
                        <button onClick={handleUpdate}><FaSave /></button>
                        <button onClick={() => setEditingId(null)}><FaTimes /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleEdit(customer)}><FaEdit /></button>
                        <button onClick={() => handleDelete(customer.id)}><FaTrash /></button>
                    </>
                )}
            </td>
        </tr>
    );
})}

                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ScanReceipts;
