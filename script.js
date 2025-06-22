document.addEventListener('DOMContentLoaded', () => {
    // --- KONUM VERİLERİ ---
    // Yeni konum eklemek için bu listeye bir obje eklemeniz yeterli.
    // x ve y değerlerini bulmak için, tarayıcıda F12 ile konsolu açıp
    // getCoordinates(event) fonksiyonunu kullanabilirsiniz. (Aşağıda tanımlı)
    const locations = [
        {
            x: 29, // Yüzde (%) cinsinden soldan uzaklık
            y: 55, // Yüzde (%) cinsinden yukarıdan uzaklık
            title: 'Suno Şehri',
            description: 'Praven Krallığı\'nın kalbinde yer alan hareketli bir ticaret şehridir. Krallığın en lezzetli tereyağları burada yapılır.'
        },
        {
            x: 20,
            y: 48,
            title: 'Praven Kalesi',
            description: 'Kral Harlaus\'un ikamet ettiği, Praven Krallığı\'nın başkentidir. Surları ve turnuvalarıyla ünlüdür.'
        },
        {
            x: 51,
            y: 52,
            title: 'Dhirim Şehri',
            description: 'Kıtanın tam ortasında yer alan stratejik bir şehir. Tarih boyunca birçok krallık tarafından ele geçirilmeye çalışılmıştır.'
        },
        {
            x: 31,
            y: 86,
            title: 'Jelkala Şehri',
            description: 'Rhodok topraklarında, denize yakın verimli bir vadide kurulmuş bir şehirdir. Güçlü arbaletçileri ile tanınır.'
        },
        {
            x: 70,
            y: 35,
            title: 'Curaw Kalesi',
            description: 'Vaegir Krallığı\'nın en kuzeydeki kalelerinden biridir. Soğuk iklimi ve sert savaşçılarıyla bilinir.'
        },
        {
            x: 80,
            y: 60,
            title: 'Tulga Şehri',
            description: 'Kergit Hanlığı\'nın bozkırlarında, göçebe kabilelerin toplandığı önemli bir merkezdir. At ticareti burada oldukça yaygındır.'
        }
    ];

    // --- ELEMENTLER ---
    const mapContainer = document.getElementById('map-container');
    const mapImage = document.getElementById('map-image');
    const infoBox = document.getElementById('info-box');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const closeButton = document.getElementById('close-button');

    // --- FONKSİYONLAR ---

    // Konum noktalarını haritaya yerleştir
    function populateMap() {
        locations.forEach(loc => {
            const point = document.createElement('div');
            point.className = 'map-point';
            point.style.left = `${loc.x}%`;
            point.style.top = `${loc.y}%`;
            point.title = loc.title; // Mouse ile üzerine gelince ismi göster
            
            point.addEventListener('click', () => {
                infoTitle.textContent = loc.title;
                infoDescription.textContent = loc.description;
                infoBox.classList.add('visible');
            });

            mapContainer.appendChild(point);
        });
    }

    // Bilgi kutusunu kapat
    function closeInfoBox() {
        infoBox.classList.remove('visible');
    }

    // Harita üzerinde sürükleme (panning)
    let isPanning = false;
    let startX, startY, scrollLeft, scrollTop;

    mapContainer.addEventListener('mousedown', (e) => {
        isPanning = true;
        mapContainer.classList.add('panning');
        startX = e.pageX - mapContainer.offsetLeft;
        startY = e.pageY - mapContainer.offsetTop;
        scrollLeft = mapContainer.scrollLeft;
        scrollTop = mapContainer.scrollTop;
    });

    mapContainer.addEventListener('mouseleave', () => {
        isPanning = false;
        mapContainer.classList.remove('panning');
    });

    mapContainer.addEventListener('mouseup', () => {
        isPanning = false;
        mapContainer.classList.remove('panning');
    });

    mapContainer.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        const x = e.pageX - mapContainer.offsetLeft;
        const y = e.pageY - mapContainer.offsetTop;
        const walkX = (x - startX) * 2; // Sürükleme hızını artır
        const walkY = (y - startY) * 2;
        mapContainer.scrollLeft = scrollLeft - walkX;
        mapContainer.scrollTop = scrollTop - walkY;
    });

    // --- YARDIMCI FONKSİYON (KOORDİNAT BULMA) ---
    // Konsola 'getCoordinates(event)' yazarak yeni noktaların koordinatlarını bulabilirsiniz.
    window.getCoordinates = (e) => {
        const rect = mapImage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        console.log(`Koordinatlar: { x: ${x.toFixed(2)}, y: ${y.toFixed(2)} }`);
    };
    // Kullanım: Haritaya sağ tıklayıp "İncele" deyin, "Konsol" sekmesine geçin.
    // Sonra haritada bir yere tıklarken konsola `mapImage.onclick = getCoordinates` yazın ve enter'a basın.
    // Artık haritaya her tıkladığınızda konsolda koordinatları göreceksiniz.

    // --- BAŞLATMA ---
    closeButton.addEventListener('click', closeInfoBox);
    populateMap();
}); 