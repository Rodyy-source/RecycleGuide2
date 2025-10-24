// بيانات وهمية لنقاط الجمع في الرياض وجدة، المملكة العربية السعودية
const recycleLocations = [
    // --- نقاط في مدينة الرياض (Lat: 24.71, Lng: 46.67) ---
    { id: 1, name: 'مركز تدوير شمال الرياض', city: 'الرياض', lat: 24.7600, lng: 46.6900, materials: ['بلاستيك', 'ورق', 'معدن'], rating: 4.5, reviews: 12 },
    { id: 2, name: 'نقطة جمع البطاريات (العليا)', city: 'الرياض', lat: 24.6950, lng: 46.6500, materials: ['بطاريات', 'أجهزة إلكترونية'], rating: 3.8, reviews: 5 },
    { id: 3, name: 'مستودع الورق والكرتون (الجنوب)', city: 'الرياض', lat: 24.6000, lng: 46.7500, materials: ['ورق', 'كرتون'], rating: 4.9, reviews: 30 },
    
    // --- نقاط في مدينة جدة (Lat: 21.48, Lng: 39.19) ---
    { id: 4, name: 'مركز جدة لإعادة التدوير', city: 'جدة', lat: 21.5100, lng: 39.1800, materials: ['بلاستيك', 'زجاج', 'معدن'], rating: 4.7, reviews: 25 },
    { id: 5, name: 'نقطة جمع الزيوت (حي السامر)', city: 'جدة', lat: 21.6100, lng: 39.2200, materials: ['زيوت مستعملة', 'عبوات بلاستيكية'], rating: 4.0, reviews: 10 },
    { id: 6, name: 'تجميع النفايات الإلكترونية (البغدادية)', city: 'جدة', lat: 21.4800, lng: 39.1700, materials: ['إلكترونيات', 'كوابل'], rating: 4.4, reviews: 15 },
    
    // يمكن إضافة المزيد من النقاط
];

// تهيئة الخريطة باستخدام Leaflet
// تم تحديد مركز الخريطة الافتراضي على الرياض (يمكنك تغييره إلى جدة أو إحداثيات متوسطة)
// سنستخدم مركز الرياض (24.7136, 46.6753) ومستوى تكبير 5 لعرض نطاق واسع يشمل المدينتين
const map = L.map('recycle-map').setView([24.7136, 46.6753], 5); 

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
            .bindPopup(`<b>${location.name} (${location.city})</b><br>${location.materials.join(', ')}`);

        // 3. إضافة المركز إلى القائمة مع التقييم
        const card = document.createElement('div');
        card.className = 'location-card';
        
        // إنشاء نجوم التقييم
        const ratingStars = '★'.repeat(Math.floor(location.rating)) + '☆'.repeat(5 - Math.floor(location.rating));
        
        card.innerHTML = `
            <h3>${location.name} (${location.city})</h3>
            <p><strong>المواد:</strong> ${location.materials.join(', ')}</p>
            <p><strong>التقييم:</strong> <span class="rating">${ratingStars}</span> (${location.rating} من 5) - ${location.reviews} مراجعة</p>
            <button onclick="zoomToLocation(${location.lat}, ${location.lng}, 14)">شاهد على الخريطة</button>
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
        // إعادة تعيين الخريطة لعرض كلتا المدينتين مرة أخرى
        map.setView([24.7136, 46.6753], 5);
        return;
    }

    // 2. البحث والتصفية (يجد المراكز التي تحتوي على المادة المبحوث عنها)
    const filtered = recycleLocations.filter(location => 
        location.materials.some(material => 
            material.toLowerCase().includes(searchTerm)
        )
    );
    
    renderLocations(filtered);
    
    // (اختياري) نقل مركز الخريطة إلى أول نتيجة وتكبيرها
    if(filtered.length > 0) {
        map.setView([filtered[0].lat, filtered[0].lng], 14);
    } else {
        alert('لم يتم العثور على مراكز لهذه المادة!');
        // إذا لم يتم العثور على شيء، نعود للمركز الواسع
        map.setView([24.7136, 46.6753], 5);
    }
}

/**
 * وظيفة للانتقال والتركيز على نقطة محددة في الخريطة
 * تم إضافة مستوى التكبير كمعامل
 */
function zoomToLocation(lat, lng, zoomLevel = 16) {
    map.setView([lat, lng], zoomLevel); 
}

// عرض جميع النقاط عند تحميل الصفحة لأول مرة
renderLocations(recycleLocations);