import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';

const FeedbackPDFReport = ({ feedbacks, reportType = 'complete', onGenerated }) => {
  // Flag to prevent multiple generations
  const [generated, setGenerated] = React.useState(false);
  
  useEffect(() => {
    if (feedbacks && feedbacks.length > 0 && !generated) {
      setGenerated(true); // Mark as generated to prevent duplicates
      generatePDF();
    }
  }, [feedbacks, reportType]);
  
  // Calculate statistics
  const calculateStats = () => {
    const totalFeedbacks = feedbacks.length;
    const averageRating = totalFeedbacks > 0
      ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedbacks).toFixed(1)
      : 0;
    
    // Group by product
    const productGroups = feedbacks.reduce((acc, feedback) => {
      if (!acc[feedback.product_id]) {
        acc[feedback.product_id] = {
          product_name: feedback.product_name,
          count: 0,
          ratings: [],
          totalRating: 0
        };
      }
      
      acc[feedback.product_id].count++;
      acc[feedback.product_id].ratings.push(feedback.rating);
      acc[feedback.product_id].totalRating += feedback.rating;
      
      return acc;
    }, {});
    
    // Calculate average ratings per product
    Object.keys(productGroups).forEach(key => {
      productGroups[key].averageRating = (productGroups[key].totalRating / productGroups[key].count).toFixed(1);
    });
    
    // Sort products by average rating (descending)
    const sortedProducts = Object.values(productGroups).sort((a, b) => b.averageRating - a.averageRating);
    
    // Monthly trend data
    const monthlyData = feedbacks.reduce((acc, feedback) => {
      const date = new Date(feedback.created_at || feedback.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          count: 0,
          totalRating: 0,
          month: date.toLocaleString('default', { month: 'short' }),
          year: date.getFullYear()
        };
      }
      
      acc[monthYear].count++;
      acc[monthYear].totalRating += feedback.rating;
      
      return acc;
    }, {});
    
    // Calculate monthly averages and sort by date
    const monthlyTrends = Object.entries(monthlyData)
      .map(([key, data]) => ({
        ...data,
        averageRating: (data.totalRating / data.count).toFixed(1),
        monthYear: key
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.monthYear.split('/');
        const [bMonth, bYear] = b.monthYear.split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
      
    // Rating distribution
    const ratingDistribution = {
      5: feedbacks.filter(f => f.rating === 5).length,
      4: feedbacks.filter(f => f.rating === 4).length,
      3: feedbacks.filter(f => f.rating === 3).length,
      2: feedbacks.filter(f => f.rating === 2).length,
      1: feedbacks.filter(f => f.rating === 1).length,
    };
    
    return {
      totalFeedbacks,
      averageRating,
      productGroups,
      sortedProducts,
      monthlyTrends,
      ratingDistribution
    };
  };

  const generatePDF = () => {
    const stats = calculateStats();
    const { totalFeedbacks, averageRating, sortedProducts, monthlyTrends, ratingDistribution } = stats;
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Define colors
    const colors = {
      primary: '#774E9B', // Purple for Chara Cakes
      secondary: '#FF85B3', // Pink
      text: '#333333',
      lightText: '#777777',
      background: '#F9F2FF', // Light purple
      excellent: '#2ecc71',
      good: '#f1c40f',
      poor: '#e74c3c'
    };
    
    // Set default text color
    doc.setTextColor(colors.text);
    
    // Add logo and header
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Header
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Add logo
    try {
      // This is a placeholder, you'll need to replace with actual logo handling
      // doc.addImage(logo, 'PNG', 10, 10, 30, 15);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#ffffff');
    doc.setFontSize(22);
    doc.text('Chara Cakes', 50, 15);
    doc.setFontSize(16);
    doc.text('Customer Feedback Report', 50, 25);
    
    // Report Date
    doc.setTextColor('#ffffff');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${currentDate}`, 130, 15);
    
    // Report Type
    doc.setFontSize(12);
    doc.text(`Comprehensive Report`, 130, 25);
    
    // Reset text color for main content
    doc.setTextColor(colors.text);
    
    // Summary section
    let yPos = 45;
    
    // Add border around summary
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(0.5);
    doc.roundedRect(10, yPos, 190, 30, 3, 3, 'S');
    
    doc.setFillColor(colors.background);
    doc.roundedRect(10, yPos, 190, 8, 3, 3, 'F');
    
    // Summary Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text('FEEDBACK SUMMARY', 100, yPos + 6, { align: 'center' });
    
    // Summary content
    yPos += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(colors.text);
    
    doc.text(`Total Reviews: ${totalFeedbacks}`, 20, yPos);
    doc.text(`Average Rating: ${averageRating} ★`, 80, yPos);
    doc.text(`Products Reviewed: ${sortedProducts.length}`, 140, yPos);
    
    // Rating distribution
    yPos += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text('RATING DISTRIBUTION', 100, yPos, { align: 'center' });
    
    yPos += 10;
    
    // Draw rating bars
    Object.keys(ratingDistribution).sort((a, b) => Number(b) - Number(a)).forEach((rating, index) => {
      const count = ratingDistribution[rating];
      const percentage = totalFeedbacks > 0 ? (count / totalFeedbacks) * 100 : 0;
      
      // Label for the rating
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.text);
      doc.text(`${rating} ★`, 20, yPos + index * 10);
      
      // Background for the bar
      doc.setFillColor('#eeeeee');
      doc.roundedRect(30, yPos - 3 + index * 10, 120, 6, 1, 1, 'F');
      
      // Actual bar
      let barColor;
      if (rating >= 4) barColor = colors.excellent;
      else if (rating >= 3) barColor = colors.good;
      else barColor = colors.poor;
      
      doc.setFillColor(barColor);
      if (percentage > 0) {
        const barWidth = Math.max(percentage * 1.2, 3); // Ensure at least 3mm width for visibility
        doc.roundedRect(30, yPos - 3 + index * 10, barWidth, 6, 1, 1, 'F');
      }
      
      // Percentage and count
      doc.setTextColor(colors.text);
      doc.text(`${percentage.toFixed(1)}% (${count})`, 160, yPos + index * 10);
    });
    
    yPos += 60;
    
    // Top Rated Products
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text('TOP RATED PRODUCTS', 100, yPos, { align: 'center' });
    
    // Product table header
    yPos += 10;
    doc.setFillColor(colors.primary);
    doc.rect(15, yPos - 5, 180, 10, 'F');
    
    doc.setTextColor('#ffffff');
    doc.setFontSize(10);
    doc.text('Product Name', 20, yPos);
    doc.text('Reviews', 120, yPos, { align: 'center' });
    doc.text('Average Rating', 165, yPos, { align: 'center' });
    
    // Product rows
    yPos += 10;
    doc.setTextColor(colors.text);
    doc.setFont('helvetica', 'normal');
    
    // Draw table rows for top 5 products
    const topProducts = sortedProducts.slice(0, 5);
    topProducts.forEach((product, index) => {
      const rowY = yPos + index * 10;
      
      // Alternating row background
      if (index % 2 === 0) {
        doc.setFillColor('#f9f9f9');
        doc.rect(15, rowY - 5, 180, 10, 'F');
      }
      
      // Product data
      doc.setFontSize(9);
      
      // Truncate product name if too long
      let productName = product.product_name;
      if (productName.length > 40) {
        productName = productName.substring(0, 37) + '...';
      }
      
      doc.text(productName, 20, rowY);
      doc.text(product.count.toString(), 120, rowY, { align: 'center' });
      
      // Rating with star
      const ratingText = `${product.averageRating} ★`;
      doc.text(ratingText, 165, rowY, { align: 'center' });
    });
    
    // Add a second page for product details
    doc.addPage();
    
    // Header on second page
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Try to add logo again on second page
    try {
      // doc.addImage(logo, 'PNG', 10, 10, 30, 15);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
    
    // Title on second page
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#ffffff');
    doc.setFontSize(22);
    doc.text('Chara Cakes', 50, 15);
    doc.setFontSize(16);
    doc.text('Customer Feedback Report', 50, 25);
    
    // Product Performance section
    yPos = 45;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text('PRODUCT PERFORMANCE DETAILS', 100, yPos, { align: 'center' });
    
    yPos += 10;
    
    // All products performance
    const productsPerPage = 8;
    let currentPage = 0;
    
    for (let i = 0; i < sortedProducts.length; i++) {
      const product = sortedProducts[i];
      
      // If we've reached the maximum products per page, create a new page
      if (i > 0 && i % productsPerPage === 0) {
        doc.addPage();
        currentPage++;
        
        // Header on new page
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, 210, 35, 'F');
        
        try {
          // doc.addImage(logo, 'PNG', 10, 10, 30, 15);
        } catch (error) {
          console.error('Error adding logo:', error);
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#ffffff');
        doc.setFontSize(22);
        doc.text('Chara Cakes', 50, 15);
        doc.setFontSize(16);
        doc.text('Customer Feedback Report', 50, 25);
        
        doc.setTextColor(colors.text);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(colors.primary);
        doc.text('PRODUCT PERFORMANCE DETAILS (CONTINUED)', 105, 45, { align: 'center' });
        
        yPos = 55; // Reset Y position for new page
      } else {
        // Add some vertical spacing between products
        yPos += 15;
      }
      
      // Product title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(colors.primary);
      doc.text(`${i+1}. ${product.product_name}`, 20, yPos);
      
      // Product info
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      doc.text(`Reviews: ${product.count}`, 25, yPos);
      doc.text(`Average Rating: ${product.averageRating} ★`, 70, yPos);
      
      // Rating distribution for this product
      const ratings = [5, 4, 3, 2, 1];
      const ratingCounts = ratings.map(r => product.ratings.filter(rating => rating === r).length);
      
      // Create mini rating bars
      yPos += 6;
      doc.setFontSize(8);
      
      ratings.forEach((rating, index) => {
        const xPos = 25 + (index * 35);
        const count = ratingCounts[index];
        const percentage = product.count > 0 ? (count / product.count) * 100 : 0;
        
        let barColor;
        if (rating >= 4) barColor = colors.excellent;
        else if (rating >= 3) barColor = colors.good;
        else barColor = colors.poor;
        
        // Draw mini bar background
        doc.setFillColor('#eeeeee');
        doc.rect(xPos, yPos, 25, 5, 'F');
        
        // Draw actual bar
        doc.setFillColor(barColor);
        if (percentage > 0) {
          doc.rect(xPos, yPos, (percentage / 100) * 25, 5, 'F');
        }
        
        // Rating label
        doc.setTextColor(colors.text);
        doc.text(`${rating}★: ${percentage.toFixed(0)}%`, xPos + 8, yPos + 10);
      });
      
      yPos += 15;
      
      // Horizontal divider
      doc.setDrawColor('#eeeeee');
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);
    }
    
    // Add trends section on a new page
    doc.addPage();
    
    // Header
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 210, 35, 'F');
    
    try {
      // doc.addImage(logo, 'PNG', 10, 10, 30, 15);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#ffffff');
    doc.setFontSize(22);
    doc.text('Chara Cakes', 50, 15);
    doc.setFontSize(16);
    doc.text('Customer Feedback Report', 50, 25);
    
    // Monthly trends section
    yPos = 45;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text('MONTHLY FEEDBACK TRENDS', 100, yPos, { align: 'center' });
    
    // Monthly trends table header
    yPos += 15;
    doc.setFillColor(colors.primary);
    doc.rect(40, yPos - 5, 130, 10, 'F');
    
    doc.setTextColor('#ffffff');
    doc.setFontSize(10);
    doc.text('Month', 70, yPos, { align: 'center' });
    doc.text('Reviews', 110, yPos, { align: 'center' });
    doc.text('Avg. Rating', 150, yPos, { align: 'center' });
    
    // Monthly trend rows
    yPos += 10;
    doc.setTextColor(colors.text);
    doc.setFont('helvetica', 'normal');
    
    // Sort monthly trends oldest to newest
    const sortedTrends = [...monthlyTrends].sort((a, b) => {
      const [aMonth, aYear] = a.monthYear.split('/');
      const [bMonth, bYear] = b.monthYear.split('/');
      return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
    });
    
    sortedTrends.forEach((month, index) => {
      const rowY = yPos + index * 10;
      
      // Alternating row background
      if (index % 2 === 0) {
        doc.setFillColor('#f9f9f9');
        doc.rect(40, rowY - 5, 130, 10, 'F');
      }
      
      // Month data
      doc.text(`${month.month} ${month.year}`, 70, rowY, { align: 'center' });
      doc.text(month.count.toString(), 110, rowY, { align: 'center' });
      doc.text(`${month.averageRating} ★`, 150, rowY, { align: 'center' });
    });
    
    yPos += (sortedTrends.length * 10) + 15;
    
    // If there's enough space, add a simple visual graph
    if (yPos < 230 && sortedTrends.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(colors.primary);
      doc.text('REVIEW COUNT OVER TIME', 100, yPos, { align: 'center' });
      
      yPos += 15;
      
      // Find max count for scaling
      const maxCount = Math.max(...sortedTrends.map(m => m.count));
      const graphHeight = 60;
      const barWidth = 180 / Math.max(sortedTrends.length, 1);
      const barSpacing = 4;
      const adjustedBarWidth = barWidth - barSpacing;
      
      // Draw X and Y axis
      doc.setDrawColor(colors.lightText);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 20, yPos + graphHeight); // Y axis
      doc.line(20, yPos + graphHeight, 190, yPos + graphHeight); // X axis
      
      // Draw count bars
      sortedTrends.forEach((month, index) => {
        const barHeight = maxCount > 0 ? (month.count / maxCount) * graphHeight : 0;
        const barX = 20 + (index * barWidth) + (barSpacing / 2);
        const barY = yPos + (graphHeight - barHeight);
        
        // Draw bar
        doc.setFillColor(colors.secondary);
        if (barHeight > 0) {
          doc.rect(barX, barY, adjustedBarWidth, barHeight, 'F');
        }
        
        // X axis labels (every other month to avoid crowding)
        if (index % 2 === 0 || sortedTrends.length <= 6) {
          doc.setFontSize(7);
          doc.setTextColor(colors.text);
          doc.text(`${month.month.substring(0,3)}`, barX + (adjustedBarWidth/2), yPos + graphHeight + 7, { align: 'center' });
        }
      });
      
      // Y axis labels
      doc.setFontSize(8);
      doc.setTextColor(colors.text);
      doc.text(`${maxCount}`, 15, yPos, { align: 'right' });
      doc.text(`0`, 15, yPos + graphHeight, { align: 'right' });
    }
    
    // Recent feedback section
    doc.addPage();
    
    // Header
    doc.setFillColor(colors.primary);
    doc.rect(0, 0, 210, 35, 'F');
    
    try {
      // doc.addImage(logo, 'PNG', 10, 10, 30, 15);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#ffffff');
    doc.setFontSize(22);
    doc.text('Chara Cakes', 50, 15);
    doc.setFontSize(16);
    doc.text('Customer Feedback Report', 50, 25);
    
    // Recent feedback section
    yPos = 45;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text('RECENT CUSTOMER FEEDBACK', 100, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text);
    
    const recentFeedbacks = [...feedbacks]
      .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
      .slice(0, 10);
    
    recentFeedbacks.forEach((feedback, index) => {
      // Feedback container
      doc.setDrawColor(colors.lightText);
      doc.setLineWidth(0.2);
      doc.roundedRect(20, yPos, 170, 20, 2, 2, 'S');
      
      // Rating indicator
      let ratingColor;
      if (feedback.rating >= 4) ratingColor = colors.excellent;
      else if (feedback.rating >= 3) ratingColor = colors.good;
      else ratingColor = colors.poor;
      
      doc.setFillColor(ratingColor);
      doc.roundedRect(165, yPos + 2, 20, 7, 1, 1, 'F');
      
      doc.setTextColor('#ffffff');
      doc.setFontSize(8);
      doc.text(`${feedback.rating} ★`, 175, yPos + 6, { align: 'center' });
      
      // Product and customer
      doc.setTextColor(colors.primary);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(feedback.product_name, 25, yPos + 6);
      
      doc.setTextColor(colors.lightText);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`By ${feedback.customer_name} - ${new Date(feedback.created_at || feedback.createdAt).toLocaleDateString()}`, 25, yPos + 12);
      
      // Comment
      doc.setTextColor(colors.text);
      let comment = feedback.comment || 'No comment provided';
      if (comment.length > 80) {
        comment = comment.substring(0, 77) + '...';
      }
      doc.text(comment, 25, yPos + 18);
      
      yPos += 25;
      
      // If we're running out of space, add a new page
      if (yPos > 260 && index < recentFeedbacks.length - 1) {
        doc.addPage();
        
        // Header
        doc.setFillColor(colors.primary);
        doc.rect(0, 0, 210, 35, 'F');
        
        try {
          // doc.addImage(logo, 'PNG', 10, 10, 30, 15);
        } catch (error) {
          console.error('Error adding logo:', error);
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#ffffff');
        doc.setFontSize(22);
        doc.text('Chara Cakes', 50, 15);
        doc.setFontSize(16);
        doc.text('Customer Feedback Report', 50, 25);
        
        doc.setTextColor(colors.primary);
        doc.text('RECENT CUSTOMER FEEDBACK (CONTINUED)', 105, 45, { align: 'center' });
        
        yPos = 55; // Reset Y position for new page
      }
    });
    
    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer bar
      doc.setFillColor(colors.primary);
      doc.rect(0, 285, 210, 12, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor('#ffffff');
      doc.text('Chara Cakes Customer Feedback Report', 105, 291, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 190, 291);
    }
    
    // Save the PDF
    const fileName = `chara-cakes-feedback-report-${new Date().toISOString().slice(0, 10)}.pdf`;
    if (onGenerated) {
      onGenerated(doc.output('blob'), fileName);
    } else {
      doc.save(fileName);
    }
  };

  return null; // This component doesn't render anything, it just generates the PDF
};

export default FeedbackPDFReport;