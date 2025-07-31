// 成长导航网站脚本
// 模块化设计，提高可维护性

class GrowthNavigation {
  constructor() {
    // 初始化变量
    this.menuToggle = document.getElementById('menu-toggle');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.navbar = document.getElementById('navbar');
    this.backToTopButton = document.getElementById('back-to-top');
    this.resourceFilters = document.querySelectorAll('.resource-filter');
    this.resourceCards = document.querySelectorAll('.resource-card');
    this.contactForm = document.getElementById('contact-form');
    this.animateCards = document.querySelectorAll('.resource-card, .tool-card, .problem-card');

    // 初始化事件监听
    this.initEventListeners();
  }

  // 初始化所有事件监听器
  initEventListeners() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
      this.initMobileMenu();
      this.initNavbarScroll();
      this.initSmoothScroll();
      this.initBackToTop();
      this.initResourceFilter();
      this.initContactForm();
      this.initCardAnimations();
      this.initPageLoad();
    });
  }

  // 移动端菜单切换
  initMobileMenu() {
    if (this.menuToggle && this.mobileMenu) {
      this.menuToggle.addEventListener('click', () => {
        this.mobileMenu.classList.toggle('hidden');
        // 添加菜单切换动画
        this.mobileMenu.classList.toggle('animate-fade-in');
      });
    }
  }

  // 导航栏滚动效果
  initNavbarScroll() {
    window.addEventListener('scroll', () => {
      if (this.navbar) {
        if (window.scrollY > 50) {
          this.navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
          this.navbar.classList.remove('shadow-sm', 'bg-white');
        } else {
          this.navbar.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-sm');
          this.navbar.classList.add('shadow-sm', 'bg-white');
        }
      }
    });
  }

  // 平滑滚动
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // 平滑滚动到目标位置
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });

          // 如果是移动端，点击后关闭菜单
          if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
            this.mobileMenu.classList.add('hidden');
          }
        }
      });
    });
  }

  // 返回顶部按钮
  initBackToTop() {
    window.addEventListener('scroll', () => {
      if (this.backToTopButton) {
        if (window.scrollY > 300) {
          this.backToTopButton.classList.remove('opacity-0', 'invisible');
          this.backToTopButton.classList.add('opacity-100', 'visible');
        } else {
          this.backToTopButton.classList.add('opacity-0', 'invisible');
          this.backToTopButton.classList.remove('opacity-100', 'visible');
        }
      }
    });

    if (this.backToTopButton) {
      this.backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // 资源筛选功能
  initResourceFilter() {
    if (this.resourceFilters.length && this.resourceCards.length) {
      this.resourceFilters.forEach(filter => {
        filter.addEventListener('click', () => {
          // 更新活跃状态
          this.resourceFilters.forEach(f => {
            f.classList.remove('active', 'bg-primary', 'text-white');
            f.classList.add('bg-gray-100', 'text-neutral');
          });
          filter.classList.add('active', 'bg-primary', 'text-white');
          filter.classList.remove('bg-gray-100', 'text-neutral');

          const filterValue = filter.getAttribute('data-filter');

          // 筛选资源卡片并添加动画
          this.resourceCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, 50);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          });
        });
      });
    }
  }

  // 联系表单提交处理
  initContactForm() {
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 获取表单数据
        const formData = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value.trim()
        };

        // 表单验证
        if (!formData.name) {
          this.showFormError('name', '请输入你的姓名');
          return;
        } else {
          this.removeFormError('name');
        }

        if (!formData.email) {
          this.showFormError('email', '请输入你的邮箱');
          return;
        } else if (!this.validateEmail(formData.email)) {
          this.showFormError('email', '请输入有效的邮箱地址');
          return;
        } else {
          this.removeFormError('email');
        }

        if (!formData.message) {
          this.showFormError('message', '请输入你的留言');
          return;
        } else {
          this.removeFormError('message');
        }

        // 提交表单
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 发送中...';

        // 模拟API请求
        setTimeout(() => {
          // 显示成功消息
          this.showNotification('感谢你的留言！我们会尽快回复你。', 'success');
          this.contactForm.reset();
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }, 1500);
      });
    }
  }

  // 显示表单错误
  showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    errorElement.className = 'text-red-500 text-sm mt-1';
    errorElement.id = `${fieldId}-error`;
    errorElement.textContent = message;

    this.removeFormError(fieldId);
    field.classList.add('border-red-500');
    field.parentNode.appendChild(errorElement);
  }

  // 移除表单错误
  removeFormError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (errorElement) {
      errorElement.remove();
    }
    field.classList.remove('border-red-500');
  }

  // 验证邮箱格式
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // 卡片悬停动画效果
  initCardAnimations() {
    this.animateCards.forEach(card => {
      // 添加初始动画类
      card.classList.add('transition-all', 'duration-300');

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
    });
  }

  // 页面加载动画
  initPageLoad() {
    // 添加页面加载完成的类
    document.body.classList.add('loaded');

    // 初始化滚动动画
    this.initScrollAnimations();
  }

  // 滚动动画
  initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animateElements.forEach(element => {
      observer.observe(element);
    });
  }

  // 显示通知
  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500 translate-x-full`;

    // 设置通知样式
    if (type === 'success') {
      notification.classList.add('bg-green-500', 'text-white');
      notification.innerHTML = `<i class="fa fa-check-circle mr-2"></i> ${message}`;
    } else if (type === 'error') {
      notification.classList.add('bg-red-500', 'text-white');
      notification.innerHTML = `<i class="fa fa-exclamation-circle mr-2"></i> ${message}`;
    } else {
      notification.classList.add('bg-blue-500', 'text-white');
      notification.innerHTML = `<i class="fa fa-info-circle mr-2"></i> ${message}`;
    }

    // 添加到页面
    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
      notification.classList.add('translate-x-0');
    }, 100);

    // 自动关闭通知
    setTimeout(() => {
      notification.classList.remove('translate-x-0');
      notification.classList.add('translate-x-full');

      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }
}

// 初始化应用
const growthNav = new GrowthNavigation();