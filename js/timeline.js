/**
 * Womencypedia Interactive Timeline
 * Uses D3.js for timeline visualization
 */

// Timeline Data
const timelineData = [
    { id: 1, name: "Hatshepsut", year: -1479, era: "ancient", region: "africa", domain: "leadership", description: "One of the most successful pharaohs of Ancient Egypt" },
    { id: 2, name: "Hypatia", year: 370, era: "ancient", region: "africa", domain: "science", description: "Greek mathematician, astronomer, and philosopher" },
    { id: 3, name: "Wu Zetian", year: 624, era: "medieval", region: "asia", domain: "leadership", description: "The only woman in Chinese history to assume the title of Empress Regnant" },
    { id: 4, name: "Hildegard of Bingen", year: 1098, era: "medieval", region: "europe", domain: "faith", description: "German Benedictine abbess, writer, and composer" },
    { id: 5, name: "Queen Amina", year: 1533, era: "medieval", region: "africa", domain: "leadership", description: "Warrior queen of Zazzau in what is now Nigeria" },
    { id: 6, name: "Mary Seacole", year: 1805, era: "colonial", region: "americas", domain: "enterprise", description: "Jamaican-British businesswoman and nurse" },
    { id: 7, name: "Madam C.J. Walker", year: 1867, era: "colonial", region: "americas", domain: "enterprise", description: "First female self-made millionaire in America" },
    { id: 8, name: "Marie Curie", year: 1867, era: "colonial", region: "europe", domain: "science", description: "Physicist and chemist who conducted pioneering research on radioactivity" },
    { id: 9, name: "Rosalind Franklin", year: 1920, era: "modern", region: "europe", domain: "science", description: "Chemist whose work was critical to understanding the structure of DNA" },
    { id: 10, name: "Wangari Maathai", year: 1940, era: "modern", region: "africa", domain: "enterprise", description: "Environmentalist and political activist, Nobel Peace Prize laureate" },
    { id: 11, name: "Cleopatra", year: -69, era: "ancient", region: "africa", domain: "leadership", description: "Last active ruler of the Ptolemaic Kingdom of Egypt" },
    { id: 12, name: "Boudica", year: 26, era: "ancient", region: "europe", domain: "leadership", description: "Queen of the Iceni tribe who led a major uprising against Roman occupation" },
    { id: 13, name: "Khawlah bint al-Azwar", year: 634, era: "medieval", region: "asia", domain: "leadership", description: "Arab warrior from the early Islamic period" },
    { id: 14, name: "Moremi Ajasoro", year: 1300, era: "medieval", region: "africa", domain: "leadership", description: "Queen of Ile-Ife in Yoruba land, known for her bravery and wisdom" },
    { id: 15, name: "Yaa Asantewaa", year: 1840, era: "colonial", region: "africa", domain: "leadership", description: "Queen mother of the Asante kingdom who led the War of the Golden Stool" }
];

// Domain Colors
const domainColors = {
    leadership: "#7c3aed", // primary
    science: "#0d9488", // accent-teal
    arts: "#d97706", // accent-gold
    faith: "#7c3aed80", // primary with opacity
    enterprise: "#d9770680" // accent-gold with opacity
};

// Domain Labels
const domainLabels = {
    leadership: "Leadership & Politics",
    science: "Science & Innovation",
    arts: "Arts & Culture",
    faith: "Faith & Spirituality",
    enterprise: "Enterprise & Economy"
};

// Current zoom level
let currentZoom = 1;
let filteredData = [...timelineData];

// Initialize Timeline
document.addEventListener('DOMContentLoaded', function () {
    initTimeline();
    setupFilters();
    setupZoom();
});

function initTimeline() {
    const container = document.getElementById('timeline-chart');
    const containerRect = container.parentElement.getBoundingClientRect();
    const width = containerRect.width - 64;
    const height = 500;
    const margin = { top: 60, right: 40, bottom: 60, left: 40 };

    // Clear previous chart
    container.innerHTML = '';

    // Create SVG
    const svg = d3.select('#timeline-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Define gradient for connecting lines
    const defs = svg.append('defs');

    // Create scales - adjust domain based on zoom
    const yearExtent = d3.extent(timelineData, d => d.year);
    const yearRange = yearExtent[1] - yearExtent[0];
    const padding = yearRange * 0.1 / currentZoom;

    const xScale = d3.scaleLinear()
        .domain([yearExtent[0] - padding, yearExtent[1] + padding])
        .range([margin.left, width - margin.right]);

    // Create axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d < 0 ? `${Math.abs(d)} BCE` : `${d} CE`)
        .ticks(10);

    // Draw axis
    const axisGroup = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height / 2})`)
        .call(xAxis);

    axisGroup.selectAll('text')
        .style('font-family', 'Lato, sans-serif')
        .style('font-size', '12px')
        .style('fill', '#6b7280');

    axisGroup.selectAll('line')
        .style('stroke', '#e5e7eb');

    axisGroup.select('.domain')
        .style('stroke', '#e5e7eb');

    // Draw era background bands
    drawEraBands(svg, xScale, height, margin);

    // Draw events
    drawEvents(svg, xScale, height, margin);

    // Draw timeline ends
    drawTimelineEnds(svg, width, height, margin);
}

function drawEraBands(svg, xScale, height, margin) {
    const eras = [
        { name: "Ancient", start: -2000, end: 500, color: "rgba(124, 58, 237, 0.05)" },
        { name: "Medieval", start: 500, end: 1500, color: "rgba(13, 148, 136, 0.05)" },
        { name: "Colonial", start: 1500, end: 1900, color: "rgba(217, 119, 6, 0.05)" },
        { name: "Modern", start: 1900, end: 2026, color: "rgba(124, 58, 237, 0.05)" }
    ];

    const bandHeight = height / 2 - 40;

    eras.forEach(era => {
        svg.append('rect')
            .attr('x', xScale(era.start))
            .attr('y', margin.top - 30)
            .attr('width', xScale(era.end) - xScale(era.start))
            .attr('height', bandHeight + 30)
            .attr('fill', era.color)
            .attr('rx', 4);
    });
}

function drawEvents(svg, xScale, height, margin) {
    const events = svg.selectAll('.event')
        .data(filteredData)
        .enter()
        .append('g')
        .attr('class', 'event')
        .attr('transform', d => `translate(${xScale(d.year)}, ${height / 2})`)
        .style('cursor', 'pointer')
        .on('click', function (event, d) {
            showEventModal(d);
        });

    // Draw event circles
    events.append('circle')
        .attr('r', 14)
        .attr('fill', d => domainColors[d.domain])
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
        .on('mouseover', function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 18);
            showTooltip(event, d);
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 14);
            hideTooltip();
        });

    // Draw domain icon inside circle
    events.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .text(d => getDomainIcon(d.domain))
        .style('font-size', '14px')
        .style('fill', '#fff')
        .style('pointer-events', 'none');

    // Draw event labels (alternating above and below)
    events.each(function (d, i) {
        const isAbove = i % 2 === 0;
        const g = d3.select(this);

        // Connecting line
        g.append('line')
            .attr('y1', 0)
            .attr('y2', isAbove ? -35 : 35)
            .attr('stroke', domainColors[d.domain])
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2');

        // Label background
        const labelText = g.append('text')
            .attr('y', isAbove ? -50 : 55)
            .attr('text-anchor', 'middle')
            .text(d.name)
            .style('font-family', 'Playfair Display, serif')
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .style('fill', '#374151')
            .style('pointer-events', 'none');

        // Get text width for background
        const textNode = labelText.node();
        const textWidth = textNode.getBBox().width + 16;
        const textX = xScale(d.year);
        const textY = isAbove ? -58 : 63;

        // Draw text background
        g.insert('rect', 'text')
            .attr('x', textX - textWidth / 2)
            .attr('y', textY - 10)
            .attr('width', textWidth)
            .attr('height', 20)
            .attr('rx', 4)
            .attr('fill', 'white')
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 1);
    });
}

function drawTimelineEnds(svg, width, height, margin) {
    // Left end marker
    svg.append('circle')
        .attr('cx', margin.left)
        .attr('cy', height / 2)
        .attr('r', 6)
        .attr('fill', '#7c3aed');

    // Right end marker
    svg.append('circle')
        .attr('cx', width - margin.right)
        .attr('cy', height / 2)
        .attr('r', 6)
        .attr('fill', '#7c3aed');
}

function getDomainIcon(domain) {
    const icons = {
        leadership: '★',
        science: '⚛',
        arts: '🎨',
        faith: '✦',
        enterprise: '◆'
    };
    return icons[domain] || '●';
}

function showTooltip(event, data) {
    // Remove existing tooltip
    hideTooltip();

    const tooltip = d3.select('body').append('div')
        .attr('class', 'timeline-tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('padding', '16px')
        .style('border', '1px solid #e5e7eb')
        .style('border-radius', '12px')
        .style('box-shadow', '0 10px 25px rgba(0,0,0,0.15)')
        .style('z-index', '1000')
        .style('pointer-events', 'none')
        .style('max-width', '280px');

    tooltip.html(`
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span class="material-symbols-outlined" style="color: ${domainColors[data.domain]}">${getDomainIcon(data.domain)}</span>
            <span style="font-size: 11px; color: ${domainColors[data.domain]}; font-weight: 600; text-transform: uppercase;">${domainLabels[data.domain]}</span>
        </div>
        <h4 style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 4px;">${data.name}</h4>
        <p style="font-size: 13px; color: #6b7280; margin-bottom: 12px;">${data.year < 0 ? Math.abs(data.year) + ' BCE' : data.year + ' CE'}</p>
        <p style="font-size: 14px; color: #374151; line-height: 1.5; margin-bottom: 12px;">${data.description}</p>
        <a href="biography.html" style="display: inline-flex; align-items: center; font-size: 13px; color: #7c3aed; font-weight: 600; text-decoration: none;">
            Read Full Biography 
            <span class="material-symbols-outlined" style="font-size: 16px; margin-left: 4px;">arrow_forward</span>
        </a>
    `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 10) + 'px');
}

function hideTooltip() {
    d3.selectAll('.timeline-tooltip').remove();
}

function showEventModal(data) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4';
    modal.onclick = function (e) {
        if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl" onclick="event.stopPropagation()">
            <div class="flex items-center justify-between mb-6">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style="background: ${domainColors[data.domain]}20; color: ${domainColors[data.domain]}">${domainLabels[data.domain]}</span>
                <button onclick="this.closest('.fixed').remove()" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <h2 class="font-serif text-3xl font-bold text-text-main mb-2">${data.name}</h2>
            <p class="text-text-secondary text-lg mb-4">${data.year < 0 ? Math.abs(data.year) + ' BCE' : data.year + ' CE'}</p>
            <p class="text-text-secondary leading-relaxed mb-6">${data.description}</p>
            <a href="biography.html" class="inline-flex items-center justify-center h-12 px-8 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors gap-2 w-full">
                <span class="material-symbols-outlined text-[20px]">book</span>
                Read Full Biography
            </a>
        </div>
    `;

    document.body.appendChild(modal);
}

function setupFilters() {
    const eraFilter = document.getElementById('era-filter');
    const regionFilter = document.getElementById('region-filter');
    const domainFilter = document.getElementById('domain-filter');

    [eraFilter, regionFilter, domainFilter].forEach(filter => {
        filter.addEventListener('change', filterTimeline);
    });
}

function filterTimeline() {
    const era = document.getElementById('era-filter').value;
    const region = document.getElementById('region-filter').value;
    const domain = document.getElementById('domain-filter').value;

    filteredData = timelineData.filter(d => {
        if (era !== 'all' && d.era !== era) return false;
        if (region !== 'all' && d.region !== region) return false;
        if (domain !== 'all' && d.domain !== domain) return false;
        return true;
    });

    // Re-render timeline
    initTimeline();
}

function setupZoom() {
    document.getElementById('zoom-in').addEventListener('click', function () {
        currentZoom = Math.min(currentZoom * 1.5, 4);
        initTimeline();
    });

    document.getElementById('zoom-out').addEventListener('click', function () {
        currentZoom = Math.max(currentZoom / 1.5, 1);
        initTimeline();
    });

    document.getElementById('reset-zoom').addEventListener('click', function () {
        currentZoom = 1;
        initTimeline();
    });
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        initTimeline();
    }, 250);
});
