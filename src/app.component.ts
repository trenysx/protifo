import { Component, signal, computed, AfterViewInit, ElementRef, inject, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var lucide: any;

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  tools: string[];
  gallery: string[];
}

interface Service {
  title: string;
  desc: string;
  icon: string;
}

interface Skill {
  name: string;
  level: number;
  icon: string;
}

interface Process {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

type ViewState = 'home' | 'about' | 'services' | 'skills' | 'portfolio' | 'contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('matrixCanvas') matrixCanvas!: ElementRef<HTMLCanvasElement>;
  
  private animationFrameId: number | null = null;
  private resizeListener: any;

  // --- Data ---
  readonly categories = ['All', 'Web Design', 'Landing Page', 'E-commerce', 'Branding', 'Print'];
  
  readonly projects: Project[] = [
    {
      id: 1,
      title: "Zenith Corporate Website",
      category: "Web Design",
      image: "https://picsum.photos/seed/zenith/800/600",
      description: "Thiết kế website doanh nghiệp hiện đại, tối giản và chuyên nghiệp cho công ty công nghệ.",
      tools: ["Figma", "Photoshop"],
      gallery: ["https://picsum.photos/seed/z1/800/600", "https://picsum.photos/seed/z2/800/600", "https://picsum.photos/seed/z3/800/600"]
    },
    {
      id: 2,
      title: "EcoLife Green Website",
      category: "E-commerce",
      image: "https://picsum.photos/seed/eco/800/600",
      description: "Giao diện website thương mại điện tử bán các sản phẩm xanh, tập trung vào trải nghiệm mua hàng.",
      tools: ["Figma", "Adobe XD"],
      gallery: ["https://picsum.photos/seed/e1/800/600", "https://picsum.photos/seed/e2/800/600"]
    },
    {
      id: 3,
      title: "Neon Event Landing Page",
      category: "Landing Page",
      image: "https://picsum.photos/seed/neon/800/600",
      description: "Landing page sự kiện âm nhạc với phong cách Cyberpunk, hiệu ứng thị giác mạnh mẽ.",
      tools: ["Photoshop", "Midjourney"],
      gallery: ["https://picsum.photos/seed/n1/800/600", "https://picsum.photos/seed/n2/800/600"]
    },
    {
      id: 4,
      title: "Coffee House Brand Identity",
      category: "Branding",
      image: "https://picsum.photos/seed/coffee/800/600",
      description: "Bộ nhận diện thương hiệu số cho chuỗi cà phê, bao gồm website và social media template.",
      tools: ["Illustrator", "Photoshop"],
      gallery: ["https://picsum.photos/seed/c1/800/600", "https://picsum.photos/seed/c2/800/600"]
    },
    {
      id: 5,
      title: "Summer Vibes Poster",
      category: "Print",
      image: "https://picsum.photos/seed/summer/800/600",
      description: "Poster quảng cáo sự kiện mùa hè, màu sắc rực rỡ, bố cục typography táo bạo.",
      tools: ["Illustrator", "Photoshop"],
      gallery: ["https://picsum.photos/seed/s1/800/600", "https://picsum.photos/seed/s2/800/600"]
    },
    {
      id: 6,
      title: "Tech Conference Banner",
      category: "Social Media",
      image: "https://picsum.photos/seed/tech/800/600",
      description: "Bộ banner quảng cáo trên Facebook và LinkedIn cho hội thảo công nghệ.",
      tools: ["Figma", "Photoshop"],
      gallery: ["https://picsum.photos/seed/t1/800/600"]
    }
  ];

  readonly services: Service[] = [
    { title: "Thiết kế Thương hiệu", desc: "Logo, bộ nhận diện thương hiệu (danh thiếp, bao bì), brand guideline và tái định vị thương hiệu.", icon: "palette" },
    { title: "Thiết kế In ấn", desc: "Thiết kế ấn phẩm in ấn: Tờ rơi, poster, banner, brochure, catalogue, sách, tạp chí.", icon: "printer" },
    { title: "Quảng cáo & Truyền thông", desc: "Quảng cáo online/offline, banner web, social posts, infographic và email marketing template.", icon: "megaphone" },
    { title: "Thiết kế UI/UX", desc: "Giao diện Website, Landing page, App mobile (UI/UX) và các thành phần UI Kit/Component.", icon: "monitor" },
    { title: "Chuyển động & Video", desc: "Intro/outro video, banner động, animated social posts và video giải thích.", icon: "video" },
    { title: "Vẽ Minh họa", desc: "Vẽ minh họa, thiết kế nhân vật (mascot), icon set và artwork cho game/app.", icon: "pen-tool" },
    { title: "Thiết kế Bao bì", desc: "Thiết kế bao bì sản phẩm, nhãn dán, tem và dựng 3D Mockup sản phẩm chuyên nghiệp.", icon: "package" },
    { title: "Tư vấn & Chiến lược", desc: "Tư vấn chiến lược hình ảnh thương hiệu và thiết kế trải nghiệm khách hàng (UX Strategy).", icon: "trending-up" }
  ];

  readonly skills: Skill[] = [
    { name: 'Adobe Illustrator', level: 90, icon: 'pen-tool' },
    { name: 'Adobe Photoshop', level: 85, icon: 'image' },
    { name: 'Figma (Web Design)', level: 95, icon: 'figma' },
    { name: 'Adobe XD', level: 70, icon: 'layout-template' },
    { name: 'Webflow / WordPress', level: 60, icon: 'globe' },
    { name: 'Midjourney / AI', level: 80, icon: 'sparkles' },
  ];

  readonly process: Process[] = [
    { id: 1, title: 'Nghiên cứu', desc: 'Hiểu yêu cầu dự án, khách hàng, mục tiêu sản phẩm. Nghiên cứu thị trường và đối thủ.', icon: 'search' },
    { id: 2, title: 'Lên ý tưởng', desc: 'Brainstorm các ý tưởng thiết kế. Vẽ sketch, mindmap, moodboard. Xác định concept.', icon: 'lightbulb' },
    { id: 3, title: 'Phát triển', desc: 'Chọn ý tưởng tốt nhất để phát triển trên phần mềm. Tạo prototype, layout, mockup.', icon: 'monitor' },
    { id: 4, title: 'Hoàn thiện', desc: 'Lấy phản hồi từ khách hàng. Sửa lỗi, điều chỉnh chi tiết. Tối ưu hóa thiết kế.', icon: 'sliders' },
    { id: 5, title: 'Bàn giao', desc: 'Chuẩn bị file in ấn/digital, hướng dẫn kỹ thuật. Bàn giao cho khách hàng.', icon: 'rocket' },
  ];

  // --- State ---
  currentView = signal<ViewState>('home');
  selectedCategory = signal('All');
  selectedProject = signal<Project | null>(null);
  isMobileMenuOpen = signal(false);
  scrollProgress = signal(0);
  isScrolled = signal(false);

  // Mouse Parallax State
  mouseX = signal(0);
  mouseY = signal(0);

  // --- Computed ---
  filteredProjects = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.projects;
    return this.projects.filter(p => p.category === cat);
  });

  // --- Actions ---
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  navigateTo(view: ViewState) {
    this.currentView.set(view);
    this.isMobileMenuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Re-initialize icons and observers after view change
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
      this.initObserver();
      if (view === 'home') {
        this.initMatrixEffect();
      }
    }, 100);
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
    // Re-run lucide icons after DOM update (using timeout to wait for render)
    setTimeout(() => lucide?.createIcons(), 50);
  }

  openProject(project: Project) {
    this.selectedProject.set(project);
    document.body.classList.add('modal-open');
    setTimeout(() => lucide?.createIcons(), 50);
  }

  closeProject() {
    this.selectedProject.set(null);
    document.body.classList.remove('modal-open');
  }

  // --- Lifecycle ---
  constructor() {
    if (typeof window !== 'undefined') {
        // Scroll listener
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.scrollProgress.set(scrolled);
            
            if (window.scrollY > 20) {
                this.isScrolled.set(true);
            } else {
                this.isScrolled.set(false);
            }
        });

        // Mouse Move Listener for Parallax
        window.addEventListener('mousemove', (e) => {
            // Normalize mouse position from -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            this.mouseX.set(x);
            this.mouseY.set(y);
        });
    }
  }

  ngAfterViewInit() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    this.initObserver();
    
    // Start Canvas effect if on home
    if (this.currentView() === 'home') {
        this.initMatrixEffect();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeListener && typeof window !== 'undefined') {
        window.removeEventListener('resize', this.resizeListener);
    }
  }

  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));
  }

  // --- Matrix/Digital Rain Effect ---
  initMatrixEffect() {
    // Only run if canvas exists
    if (!this.matrixCanvas) return;
    
    const canvas = this.matrixCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    this.resizeListener = resize;
    window.addEventListener('resize', resize);

    // Characters (Binary + Katakana mix for style)
    const chars = '01010101XYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start at random heights above
    }

    const draw = () => {
        // Semi-transparent black to create trailing effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // Using white background logic so fade with white
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text color - Cyan/Navy gradient style
        ctx.fillStyle = '#002B5B'; // Navy Blue for contrast on white
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            
            // Randomly change color for "glitch" feel
            if (Math.random() > 0.98) {
                ctx.fillStyle = '#00ffff'; // Cyan highlight
            } else {
                ctx.fillStyle = 'rgba(0, 43, 91, 0.3)'; // Faded Navy
            }

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        this.animationFrameId = requestAnimationFrame(draw);
    };

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    draw();
  }
}