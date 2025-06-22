document.addEventListener('DOMContentLoaded', () => {
    // --- KONUM VERİLERİ ---
    const locations = [
        { 
            x: 29, 
            y: 55, 
            title: 'Suno Şehri', 
            description: 'Praven Krallığı\'nın kalbinde yer alan hareketli bir ticaret şehridir. Krallığın en lezzetli tereyağları burada yapılır.',
            color: '#ff6b6b' // Kırmızımsı
        },
        { 
            x: 20, 
            y: 48, 
            title: 'Praven Kalesi', 
            description: 'Kral Harlaus\'un ikamet ettiği, Praven Krallığı\'nın başkentidir. Surları ve turnuvalarıyla ünlüdür.',
            color: '#4ecdc4' // Turkuaz
        },
        { 
            x: 51, 
            y: 52, 
            title: 'Dhirim Şehri', 
            description: 'Kıtanın tam ortasında yer alan stratejik bir şehir. Tarih boyunca birçok krallık tarafından ele geçirilmeye çalışılmıştır.',
            color: '#45b7d1' // Mavi
        },
        { 
            x: 31, 
            y: 86, 
            title: 'Jelkala Şehri', 
            description: 'Rhodok topraklarında, denize yakın verimli bir vadide kurulmuş bir şehirdir. Güçlü arbaletçileri ile tanınır.',
            color: '#96ceb4' // Yeşil
        },
        { 
            x: 70, 
            y: 35, 
            title: 'Curaw Kalesi', 
            description: 'Vaegir Krallığı\'nın en kuzeydeki kalelerinden biridir. Soğuk iklimi ve sert savaşçılarıyla bilinir.',
            color: '#feca57' // Sarı
        },
        { 
            x: 80, 
            y: 60, 
            title: 'Tulga Şehri', 
            description: 'Kergit Hanlığı\'nın bozkırlarında, göçebe kabilelerin toplandığı önemli bir merkezdir. At ticareti burada oldukça yaygındır.',
            color: '#ff9ff3' // Pembe
        }
    ];

    // --- ELEMENTLER ---
    const mapContainer = document.getElementById('map-container');
    const mapImage = document.getElementById('map-image');
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const closeButton = document.getElementById('close-button');
    
    // Haritayı ve noktaları saran ve transforme edilecek olan yeni bir div oluşturuyoruz.
    const zoomPanWrapper = document.createElement('div');
    zoomPanWrapper.id = 'zoom-pan-wrapper';
    zoomPanWrapper.appendChild(mapImage);
    mapContainer.appendChild(zoomPanWrapper);


    // --- DURUM DEĞİŞKENLERİ ---
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let panStart = { x: 0, y: 0 };
    const maxScale = 4;
    let minScale = 0.5;

    // --- FONKSİYONLAR ---

    function applyTransform() {
        // Panın sınırlarını belirleyerek haritanın kaybolmasını engelle
        const containerRect = mapContainer.getBoundingClientRect();
        
        // Eğer harita minimum boyutta ise (tam ekranı kaplıyorsa), pan yapmaya izin verme
        if (scale <= minScale) {
            panX = (containerRect.width - mapImage.naturalWidth * scale) / 2;
            panY = (containerRect.height - mapImage.naturalHeight * scale) / 2;
        } else {
            // Normal pan sınırları
            const maxPanX = (containerRect.width * (scale - 1)) / 2;
            const maxPanY = (containerRect.height * (scale - 1)) / 2;
            
            panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
            panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
        }
        
        zoomPanWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }

    function fitMapToScreen() {
        const containerRatio = mapContainer.clientWidth / mapContainer.clientHeight;
        const imageRatio = mapImage.naturalWidth / mapImage.naturalHeight;

        if (imageRatio > containerRatio) {
            // Harita geniş, konteynere genişliğine göre sığdır
            scale = mapContainer.clientWidth / mapImage.naturalWidth;
        } else {
            // Harita yüksek, konteynere yüksekliğine göre sığdır
            scale = mapContainer.clientHeight / mapImage.naturalHeight;
        }
        
        // Minimum zoom seviyesini hesapla - harita hiçbir zaman siyah kenarlar göstermemeli
        const minScaleForCoverage = Math.max(
            mapContainer.clientWidth / mapImage.naturalWidth,
            mapContainer.clientHeight / mapImage.naturalHeight
        );
        
        // Global minScale değişkenini güncelle
        minScale = minScaleForCoverage;
        
        panX = (mapContainer.clientWidth - mapImage.naturalWidth * scale) / 2;
        panY = (mapContainer.clientHeight - mapImage.naturalHeight * scale) / 2;
        
        zoomPanWrapper.style.transition = 'none'; // İlk yerleşimde animasyon olmasın
        applyTransform();
        zoomPanWrapper.style.transition = ''; // Animasyonu tekrar aktif et
    }


    function populateMap() {
        locations.forEach(loc => {
            const point = document.createElement('div');
            point.className = 'map-point';
            point.style.left = `${loc.x}%`;
            point.style.top = `${loc.y}%`;
            point.title = loc.title;
            point.style.backgroundColor = loc.color;
            point.style.boxShadow = `0 0 15px ${loc.color}, 0 0 20px ${loc.color}`;
            
            point.addEventListener('click', () => {
                // Bilgi kutusunu göster
                infoTitle.textContent = loc.title;
                infoDescription.textContent = loc.description;
                infoBox.classList.add('visible');

                // Tıklanan noktaya yakınlaş
                const targetScale = 2; // Hedef yakınlaştırma seviyesi
                scale = Math.min(maxScale, Math.max(minScale, targetScale));

                const containerRect = mapContainer.getBoundingClientRect();
                
                // Noktanın harita üzerindeki piksel koordinatları
                const pointX = (loc.x / 100) * containerRect.width;
                const pointY = (loc.y / 100) * containerRect.height;
                
                // Konumu merkeze getirmek için pan değerlerini hesapla
                panX = containerRect.width / 2 - pointX * scale;
                panY = containerRect.height / 2 - pointY * scale;

                applyTransform();
            });

            zoomPanWrapper.appendChild(point);
        });
    }
    
    function closeInfoBox() {
        infoBox.classList.remove('visible');
    }

    // --- EVENT LISTENERS ---

    mapContainer.addEventListener('mousedown', (e) => {
        isPanning = true;
        panStart.x = e.clientX - panX;
        panStart.y = e.clientY - panY;
        mapContainer.style.cursor = 'grabbing';
    });

    mapContainer.addEventListener('mouseup', () => {
        isPanning = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('mouseleave', () => {
        isPanning = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        panX = e.clientX - panStart.x;
        panY = e.clientY - panStart.y;
        zoomPanWrapper.style.transition = 'none'; // Sürüklerken animasyon olmasın
        applyTransform();
        zoomPanWrapper.style.transition = '';
    });

    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        const newScale = Math.min(maxScale, Math.max(minScale, scale + delta));

        const rect = mapContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Mouse'un konumuna göre pan ayarı yaparak imlecin olduğu yerden zoom yap
        panX = mouseX - (mouseX - panX) * (newScale / scale);
        panY = mouseY - (mouseY - panY) * (newScale / scale);
        
        scale = newScale;
        applyTransform();
    });
    
    closeButton.addEventListener('click', closeInfoBox);

    // --- BAŞLATMA ---
    // Harita resmi tamamen yüklendiğinde başlat
    mapImage.onload = () => {
        fitMapToScreen();
        populateMap();
    };
    
    // Eğer resim cache'den geldiyse onload çalışmayabilir, bu yüzden kontrol edelim
    if (mapImage.complete) {
        mapImage.onload();
    }
});
