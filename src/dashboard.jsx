import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Dashboard.css';

const Dashboard = () => {
    const [data] = useState({
        totalEmployees: 250,
        totalIn: 180,
        totalOut: 70,
        onlineDevices: 45,
        offlineDevices: 12
    });
    const [generating, setGenerating] = useState(false);

    const handleDownloadPDF = async () => {
        setGenerating(true);

        try {
            // Hide download button
            const downloadBtn = document.querySelector('.download-btn');
            if (downloadBtn) downloadBtn.style.display = 'none';

            window.scrollTo(0, 0);
            await new Promise(resolve => setTimeout(resolve, 800));

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            const contentWidth = pdfWidth - (2 * margin);

            // Get all pages
            const pages = [
                document.getElementById('pdf-page-1'),
                document.getElementById('pdf-page-2'),
                document.getElementById('pdf-page-3')
            ];

            // Process each page
            for (let i = 0; i < pages.length; i++) {
                const pageElement = pages[i];

                if (!pageElement) continue;

                // Capture page as canvas
                const canvas = await html2canvas(pageElement, {
                    scale: 3,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    foreignObjectRendering: false,
                    windowWidth: 1200
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                const imgHeight = (canvas.height * contentWidth) / canvas.width;

                // Add new page if not first page
                if (i > 0) {
                    pdf.addPage();
                }

                // Add image to PDF
                pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, imgHeight, '', 'FAST');

                // Add page number
                pdf.setFontSize(10);
                pdf.setTextColor(150);
                pdf.text(
                    `Page ${i + 1} of ${pages.length}`,
                    pdfWidth / 2,
                    pdfHeight - 10,
                    { align: 'center' }
                );
            }

            const fileName = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            if (downloadBtn) downloadBtn.style.display = 'flex';
            setGenerating(false);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');

            const downloadBtn = document.querySelector('.download-btn');
            if (downloadBtn) downloadBtn.style.display = 'flex';
            setGenerating(false);
        }
    };

    const attendanceRate = ((data.totalIn / data.totalEmployees) * 100).toFixed(1);
    const deviceHealth = ((data.onlineDevices / (data.onlineDevices + data.offlineDevices)) * 100).toFixed(1);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard Overview</h1>
                    <p className="dashboard-subtitle">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <button
                    className="download-btn"
                    onClick={handleDownloadPDF}
                    disabled={generating}
                >
                    {generating ? (
                        <>
                            <span className="spinner"></span>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Download PDF Report
                        </>
                    )}
                </button>
            </div>

            {/* PDF Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* ============== PAGE 1: Overview & Stats ============== */}
                <div id="pdf-page-1" style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid #e0e0e0',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    minHeight: '1000px'
                }}>
                    {/* Report Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        paddingBottom: '25px',
                        borderBottom: '4px solid #667eea'
                    }}>
                        <h1 style={{
                            fontSize: '42px',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '12px',
                            letterSpacing: '-0.5px'
                        }}>
                            Dashboard Report
                        </h1>
                        <p style={{
                            color: '#6c757d',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}>
                            Generated on {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Executive Summary */}
                    <div style={{
                        background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
                        padding: '30px',
                        borderRadius: '16px',
                        border: '2px solid #e9ecef',
                        marginBottom: '30px'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '20px',
                            borderBottom: '3px solid #667eea',
                            paddingBottom: '10px'
                        }}>Executive Summary</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            fontSize: '15px',
                            lineHeight: '1.8',
                            color: '#495057'
                        }}>
                            <div>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: '#1a1a1a' }}>Total Workforce:</strong> {data.totalEmployees} employees
                                </p>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: '#48bb78' }}>Present Today:</strong> {data.totalIn} ({attendanceRate}%)
                                </p>
                            </div>
                            <div>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: '#f56565' }}>Absent Today:</strong> {data.totalOut} ({(100 - attendanceRate).toFixed(1)}%)
                                </p>
                                <p style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: '#ed8936' }}>Device Health:</strong> {deviceHealth}% operational
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        marginBottom: '20px'
                    }}>Key Metrics</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        {/* Employee Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '2px solid #e9ecef',
                            borderLeft: '6px solid #667eea',
                            display: 'flex',
                            gap: '20px',
                            minHeight: '140px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: '3px solid #5568d3'
                            }}>
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '700' }}>Total Employees</p>
                                <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#667eea', lineHeight: '1', marginBottom: '8px' }}>{data.totalEmployees}</h2>
                                <p style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>Active in system</p>
                            </div>
                        </div>

                        {/* In Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '2px solid #e9ecef',
                            borderLeft: '6px solid #48bb78',
                            display: 'flex',
                            gap: '20px',
                            minHeight: '140px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                border: '3px solid #3da863'
                            }}>
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="10 17 15 12 10 7" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '700' }}>Total In</p>
                                <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#48bb78', lineHeight: '1', marginBottom: '8px' }}>{data.totalIn}</h2>
                                <p style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>{attendanceRate}% attendance rate</p>
                            </div>
                        </div>

                        {/* Out Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '2px solid #e9ecef',
                            borderLeft: '6px solid #f56565',
                            display: 'flex',
                            gap: '20px',
                            minHeight: '140px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                                border: '3px solid #e04e4e'
                            }}>
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '700' }}>Total Out</p>
                                <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#f56565', lineHeight: '1', marginBottom: '8px' }}>{data.totalOut}</h2>
                                <p style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>Currently absent</p>
                            </div>
                        </div>

                        {/* Devices Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '2px solid #e9ecef',
                            borderLeft: '6px solid #ed8936',
                            display: 'flex',
                            gap: '20px',
                            minHeight: '140px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                                border: '3px solid #d87b2a'
                            }}>
                                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <p style={{ fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '700' }}>Device Status</p>
                                <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#ed8936', lineHeight: '1', marginBottom: '8px' }}>{data.onlineDevices}/{data.onlineDevices + data.offlineDevices}</h2>
                                <p style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>{deviceHealth}% online</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer for Page 1 */}
                    <div style={{
                        marginTop: '50px',
                        paddingTop: '25px',
                        borderTop: '3px solid #e9ecef',
                        textAlign: 'center',
                        color: '#adb5bd',
                        fontSize: '12px'
                    }}>
                        <p style={{ fontWeight: '600' }}>Access Control System - EINS</p>
                    </div>
                </div>

                {/* ============== PAGE 2: Detailed Analytics ============== */}
                <div id="pdf-page-2" style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid #e0e0e0',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    minHeight: '1000px'
                }}>
                    {/* Page Header */}
                    <div style={{
                        marginBottom: '40px',
                        paddingBottom: '20px',
                        borderBottom: '3px solid #667eea'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '8px'
                        }}>Detailed Analytics</h1>
                        <p style={{ color: '#6c757d', fontSize: '14px' }}>Comprehensive breakdown of attendance and device status</p>
                    </div>

                    {/* Device Health Section */}
                    <div style={{
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '2px solid #e9ecef',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '25px',
                            borderBottom: '3px solid #667eea',
                            paddingBottom: '12px'
                        }}>Device Health Status</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                borderRadius: '12px',
                                background: '#f0fdf4',
                                border: '3px solid #48bb78'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: '#48bb78',
                                        border: '3px solid #38a169'
                                    }}></span>
                                    <span style={{ fontSize: '18px', color: '#1a1a1a', fontWeight: '700' }}>Online Devices</span>
                                </div>
                                <span style={{ fontSize: '36px', fontWeight: '700', color: '#48bb78' }}>{data.onlineDevices}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '20px',
                                borderRadius: '12px',
                                background: '#fef2f2',
                                border: '3px solid #f56565'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        background: '#f56565',
                                        border: '3px solid #e53e3e'
                                    }}></span>
                                    <span style={{ fontSize: '18px', color: '#1a1a1a', fontWeight: '700' }}>Offline Devices</span>
                                </div>
                                <span style={{ fontSize: '36px', fontWeight: '700', color: '#f56565' }}>{data.offlineDevices}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '10px'
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#495057' }}>Operational Status</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#48bb78' }}>{deviceHealth}%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '28px',
                                background: '#e9ecef',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                border: '2px solid #dee2e6'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${deviceHealth}%`,
                                    background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    paddingRight: '12px'
                                }}>
                                    <span style={{
                                        color: 'white',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>{deviceHealth}%</span>
                                </div>
                            </div>
                        </div>

                        <p style={{
                            fontSize: '15px',
                            color: '#495057',
                            textAlign: 'center',
                            fontWeight: '600',
                            marginTop: '15px',
                            padding: '12px',
                            background: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            {data.onlineDevices} out of {data.onlineDevices + data.offlineDevices} devices are currently operational
                        </p>
                    </div>

                    {/* Attendance Breakdown Section */}
                    <div style={{
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '2px solid #e9ecef'
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '25px',
                            borderBottom: '3px solid #667eea',
                            paddingBottom: '12px'
                        }}>Attendance Breakdown</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {/* Present */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#48bb78' }}>Present Employees</span>
                                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#48bb78' }}>{data.totalIn}</span>
                                </div>
                                <div style={{
                                    height: '50px',
                                    background: '#e9ecef',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '2px solid #dee2e6',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${attendanceRate}%`,
                                        background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                    }}>
                                        {attendanceRate}% Present
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
                                    {data.totalIn} employees are currently in the facility
                                </p>
                            </div>

                            {/* Absent */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#f56565' }}>Absent Employees</span>
                                    <span style={{ fontSize: '32px', fontWeight: '700', color: '#f56565' }}>{data.totalOut}</span>
                                </div>
                                <div style={{
                                    height: '50px',
                                    background: '#e9ecef',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '2px solid #dee2e6',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${100 - attendanceRate}%`,
                                        background: 'linear-gradient(90deg, #f56565 0%, #e53e3e 100%)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                    }}>
                                        {(100 - attendanceRate).toFixed(1)}% Absent
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
                                    {data.totalOut} employees are currently not in the facility
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer for Page 2 */}
                    <div style={{
                        marginTop: '50px',
                        paddingTop: '25px',
                        borderTop: '3px solid #e9ecef',
                        textAlign: 'center',
                        color: '#adb5bd',
                        fontSize: '12px'
                    }}>
                        <p style={{ fontWeight: '600' }}>Access Control System - EINS</p>
                    </div>
                </div>

                {/* ============== PAGE 3: Summary & Recommendations ============== */}
                <div id="pdf-page-3" style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid #e0e0e0',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    minHeight: '1000px'
                }}>
                    {/* Page Header */}
                    <div style={{
                        marginBottom: '40px',
                        paddingBottom: '20px',
                        borderBottom: '3px solid #667eea'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '8px'
                        }}>Summary & Insights</h1>
                        <p style={{ color: '#6c757d', fontSize: '14px' }}>Key takeaways and action items</p>
                    </div>

                    {/* Key Insights */}
                    <div style={{
                        background: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '3px solid #667eea',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#667eea',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{ fontSize: '28px' }}>💡</span> Key Insights
                        </h3>

                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            <li style={{
                                fontSize: '16px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                paddingLeft: '30px',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    fontSize: '20px',
                                    color: '#48bb78'
                                }}>✓</span>
                                <strong>Attendance Rate:</strong> {attendanceRate}% of employees are present today, which is {parseFloat(attendanceRate) > 75 ? 'above' : 'below'} the target threshold of 75%.
                            </li>
                            <li style={{
                                fontSize: '16px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                paddingLeft: '30px',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    fontSize: '20px',
                                    color: parseFloat(deviceHealth) > 80 ? '#48bb78' : '#f56565'
                                }}>✓</span>
                                <strong>Device Health:</strong> {deviceHealth}% of access control devices are operational. {parseFloat(deviceHealth) < 90 ? `${data.offlineDevices} devices require immediate attention.` : 'All systems functioning optimally.'}
                            </li>
                            <li style={{
                                fontSize: '16px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                paddingLeft: '30px',
                                position: 'relative'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    fontSize: '20px',
                                    color: '#667eea'
                                }}>✓</span>
                                <strong>System Capacity:</strong> Current occupancy is {data.totalIn} out of {data.totalEmployees} total capacity ({attendanceRate}% utilization).
                            </li>
                        </ul>
                    </div>

                    {/* Recommendations */}
                    <div style={{
                        background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '3px solid #ed8936',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#ed8936',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{ fontSize: '28px' }}>📋</span> Recommendations
                        </h3>

                        <ol style={{
                            padding: '0 0 0 25px',
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {parseFloat(deviceHealth) < 90 && (
                                <li style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', paddingLeft: '10px' }}>
                                    <strong>Priority Action:</strong> Investigate and repair {data.offlineDevices} offline devices to restore full system functionality.
                                </li>
                            )}
                            {parseFloat(attendanceRate) < 75 && (
                                <li style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', paddingLeft: '10px' }}>
                                    <strong>Attendance Review:</strong> Current attendance ({attendanceRate}%) is below target. Consider reviewing attendance policies or investigating causes.
                                </li>
                            )}
                            <li style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', paddingLeft: '10px' }}>
                                <strong>Regular Monitoring:</strong> Schedule daily system health checks to maintain optimal device performance.
                            </li>
                            <li style={{ fontSize: '16px', color: '#1a1a1a', lineHeight: '1.6', paddingLeft: '10px' }}>
                                <strong>Data Tracking:</strong> Continue generating daily reports to identify trends and patterns in attendance and device health.
                            </li>
                        </ol>
                    </div>

                    {/* Contact Information */}
                    <div style={{
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        padding: '28px',
                        borderRadius: '16px',
                        border: '2px solid #e9ecef',
                        textAlign: 'center'
                    }}>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '15px'
                        }}>Need Assistance?</h4>
                        <p style={{
                            fontSize: '15px',
                            color: '#6c757d',
                            lineHeight: '1.6',
                            marginBottom: '15px'
                        }}>
                            For technical support or system inquiries, please contact the IT department.<br />
                            Email: support@eins.com | Phone: +91 (22) 1234-5678
                        </p>
                        <div style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            Emergency Support: Available 24/7
                        </div>
                    </div>

                    {/* Final Footer */}
                    <div style={{
                        marginTop: '50px',
                        paddingTop: '25px',
                        borderTop: '4px solid #667eea',
                        textAlign: 'center',
                        color: '#6c757d',
                        fontSize: '13px'
                    }}>
                        <p style={{ fontWeight: '700', marginBottom: '8px', fontSize: '15px', color: '#1a1a1a' }}>
                            Access Control System - EINS Dashboard Report
                        </p>
                        <p style={{ fontWeight: '500' }}>© {new Date().getFullYear()} EINS. All rights reserved.</p>
                        <p style={{ fontSize: '12px', marginTop: '8px', color: '#adb5bd' }}>
                            This report is confidential and intended for internal use only.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
