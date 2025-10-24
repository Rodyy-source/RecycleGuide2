// بيانات وهمية لنقاط الجمع في الرياض، السعودية
const recycleLocations = [
    // الإحداثيات تم اختيارها لتمثيل مواقع مختلفة في الرياض
    { id: 1, name: 'مركز الشمال لإعادة التدوير', lat: 24.7500, lng: 46.6800, materials: ['بلاستيك', 'ورق', 'معدن'], rating: 4.5, reviews: 12 },
    { id: 2, name: 'نقطة البطاريات في العليا', lat: 24.7000, lng: 46.6500, materials: ['بطاريات', 'أجهزة إلكترونية'], rating: 3.8, reviews: 5 },
    { id: 3, name: 'جمعية الرياض الخضراء', lat: 24.7200, lng: 46.7000, materials: ['زجاج', 'ورق'], rating: 5.0, reviews: 20 },
    { id: 4, name: 'نقطة تجميع الزيوت المستعملة', lat: 24.6850, lng: 46.6650, materials: ['زيوت', 'سوائل'], rating: 4.1, reviews: 8 }
    // يمكنك إضافة المزيد من النقاط هنا
];

// تهيئة الخريطة باستخدام Leaflet
// تم تحديد مركز الخريطة الافتراضي ليكون وسط الرياض تقريباً: (24.7136, 46.6753)
// مستوى التكبير (zoom level) هو 11
const map = L.map('recycle-map').setView([24.7136, 46.6753], 11); 

// إضافة طبقة البلاط (Tiles) من OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/**
 * وظيفة لعرض النقاط على الخريطة وقائمة المراكز
 * @param {Array} locationsToDisplay - قائمة المواقع التي سيتم عرضها.
 */
function renderLocations(locationsToDisplay) {
    // إزالة جميع علامات (Markers) القديمة
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    const locationsContainer = document.getElementById('locations-container');
    locationsContainer.innerHTML = ''; // مسح القائمة القديمة

    locationsToDisplay.forEach(location => {
        // 1. إضافة نقطة (Marker) على الخريطة
        const marker = L.marker([location.lat, location.lng]).addTo(map)
            .bindPopup(`<b>${location.name}</b><br>${location.materials.join(', ')}`);

        // 3. إضافة المركز إلى القائمة مع التقييم
        const card = document.createElement('div');
        card.className = 'location-card';
        
        // إنشاء نجوم التقييم
        const ratingStars = '★'.repeat(Math.floor(location.rating)) + '☆'.repeat(5 - Math.floor(location.rating));
        
        card.innerHTML = `
            <h3>${location.name}</h3>
            <p><strong>المواد:</strong> ${location.materials.join(', ')}</p>
            <p><strong>التقييم:</strong> <span class="rating">${ratingStars}</span> (${location.rating} من 5) - ${location.reviews} مراجعة</p>
            <button onclick="zoomToLocation(${location.lat}, ${location.lng})">شاهد على الخريطة</button>
            <button onclick="alert('سيمكن للمستخدمين إضافة تقييماتهم هنا.')">أضف تقييمك</button>
        `;
        locationsContainer.appendChild(card);
    });
}

/**
 * وظيفة للبحث والتصفية حسب نوع المادة
 */
function filterLocations() {
    const searchTerm = document.getElementById('material-search').value.toLowerCase().trim();
    
    if (searchTerm === "") {
        renderLocations(recycleLocations); // عرض الكل إذا كان البحث فارغاً
        return;
    }

    // 2. البحث والتصفية (يجد المراكز التي تحتوي على المادة المبحوث عنها)
    const filtered = recycleLocations.filter(location => 
        location.materials.some(material => 
            material.toLowerCase().includes(searchTerm)
        )
    );
    
    renderLocations(filtered);
    
    // (اختياري) نقل مركز الخريطة إلى أول نتيجة
    if(filtered.length > 0) {
        map.setView([filtered[0].lat, filtered[0].lng], 14);
    } else {
        alert('لم يتم العثور على مراكز لهذه المادة!');
    }
}

/**
 * وظيفة للانتقال والتركيز على نقطة محددة في الخريطة
 */
function zoomToLocation(lat, lng) {
    map.setView([lat, lng], 16); // 16 مستوى تكبير مناسب
}

// عرض جميع النقاط عند تحميل الصفحة لأول مرة
renderLocations(recycleLocations);