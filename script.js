(function(){
  "use strict";

  var WHATSAPP_NUMBER = "201069086119";

  var PACKAGES = {
    "1": { label: "القميص الملكي المنفرد", price: 600, items: "تيشرت واحد فريد من اختيار العميل" },
    "2": { label: "عروض الأكثر من قطعة", price: 790, items: "طقم مخصص (عدد القطع حسب اختيار العميل)" },
    "3": { label: "طقم الأطفال الفرعوني", price: 750, items: "طقم أطفال كامل (التيشرت الأحمر + الشورت الأبيض)" }
  };

  /* قائمة الموبايل */
  var burgerBtn = document.getElementById("burgerBtn");
  var navLinks  = document.getElementById("navLinks");

  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener("click", function(){
      var isOpen = navLinks.classList.toggle("open");
      burgerBtn.classList.toggle("open", isOpen);
      burgerBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        navLinks.classList.remove("open");
        burgerBtn.classList.remove("open");
        burgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* السلايدر الأول (المعرض الرسمي) */
  var track       = document.getElementById("sliderTrack");
  if (track) {
    var slides     = track.querySelectorAll(".slide");
    var totalSlides = slides.length;
    var currentIndex = 0;

    var counterCurrent = document.getElementById("slideCurrent");
    var counterTotal   = document.getElementById("slideTotal");
    var dotsWrap        = document.getElementById("sliderDots");
    var prevBtn = document.getElementById("prevBtn");
    var nextBtn = document.getElementById("nextBtn");

    if (counterTotal) counterTotal.textContent = totalSlides;

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement("button");
        dot.setAttribute("aria-label", "الانتقال للصورة رقم " + (i + 1));
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", (function(idx){
          return function(){ goToSlide(idx); };
        })(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateSlider(){
      var viewportWidth = document.querySelector('.slider-track-viewport').clientWidth;
      track.style.transform = "translateX(" + (currentIndex * viewportWidth) + "px)";
      
      if (counterCurrent) counterCurrent.textContent = currentIndex + 1;
      if (dotsWrap) {
        var dots = dotsWrap.querySelectorAll("button");
        dots.forEach(function(d, idx){
          d.classList.toggle("active", idx === currentIndex);
        });
      }
    }

    function goToSlide(idx){
      currentIndex = (idx + totalSlides) % totalSlides;
      updateSlider();
    }

    if (prevBtn) prevBtn.addEventListener("click", function(){ goToSlide(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function(){ goToSlide(currentIndex + 1); });

    var touchStartX = 0;
    var touchEndX = 0;

    track.addEventListener("touchstart", function(e){
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener("touchend", function(e){
      touchEndX = e.changedTouches[0].screenX;
      var delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) { goToSlide(currentIndex + 1); }
        else { goToSlide(currentIndex - 1); }
      }
    }, { passive: true });

    window.addEventListener('resize', updateSlider);
  }

  /* السلايدر الثاني الجديد (معرض صور الطبيعة المخصص) */
  var realTrack = document.getElementById("realGalleryTrack");
  var realPrevBtn = document.getElementById("realPrevBtn");
  var realNextBtn = document.getElementById("realNextBtn");

  if (realTrack && realPrevBtn && realNextBtn) {
    var realSlides = realTrack.querySelectorAll(".slide");
    var totalRealSlides = realSlides.length;
    var realIndex = 0;

    function updateRealSlider() {
      var viewWidth = realTrack.parentElement.clientWidth;
      realTrack.style.transform = "translateX(" + (realIndex * viewWidth) + "px)";
    }

    function goToRealSlide(idx) {
      realIndex = (idx + totalRealSlides) % totalRealSlides;
      updateRealSlider();
    }

    realPrevBtn.addEventListener("click", function() { goToRealSlide(realIndex - 1); });
    realNextBtn.addEventListener("click", function() { goToRealSlide(realIndex + 1); });

    var rTouchStart = 0;
    var rTouchEnd = 0;
    realTrack.addEventListener("touchstart", function(e) {
      rTouchStart = e.changedTouches[0].screenX;
    }, { passive: true });

    realTrack.addEventListener("touchend", function(e) {
      rTouchEnd = e.changedTouches[0].screenX;
      var delta = rTouchEnd - rTouchStart;
      if (Math.abs(delta) > 40) {
        if (delta < 0) { goToRealSlide(realIndex + 1); }
        else { goToRealSlide(realIndex - 1); }
      }
    }, { passive: true });

    window.addEventListener('resize', updateRealSlider);
  }


  /* ميزة خيار الطباعة التفاعلي */
  var enablePrinting = document.getElementById("enablePrinting");
  var printingTextFieldWrap = document.getElementById("printingTextFieldWrap");
  var printingTextInput = document.getElementById("printingText");
  var invPrintingRow = document.getElementById("invPrintingRow");

  if (enablePrinting && printingTextFieldWrap) {
    enablePrinting.addEventListener("change", function() {
      if (this.checked) {
        printingTextFieldWrap.style.display = "block";
        if (invPrintingRow) invPrintingRow.style.display = "flex";
      } else {
        printingTextFieldWrap.style.display = "none";
        if (invPrintingRow) invPrintingRow.style.display = "none";
        if (printingTextInput) printingTextInput.value = "";
      }
      updateInvoice();
    });
  }


  /* أزرار الشراء الفوري وتحديث الراديو بالفورم */
  document.querySelectorAll("[data-select-package]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      var pkg = btn.getAttribute("data-select-package");
      var radio = document.getElementById("pkgOption" + pkg);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change"));
      }
      
      // مزامنة تلقائية للمقاسات حسب الباقة
      var sizeSrc = document.getElementById("sizeSelectPkg" + pkg);
      var sizeDst = document.getElementById("checkoutSize");
      if (sizeSrc && sizeDst) { 
        // تحديث قائمة السحب في الفورم بالخيار المناسب لباقة الأطفال أو الكبار
        updateCheckoutSizeOptions(pkg);
        sizeDst.value = sizeSrc.value; 
      }
      updateInvoice();
    });
  });

  // دالة لتغيير خيارات حقل المقاسات ديناميكياً إذا تم اختيار باقة الأطفال
  function updateCheckoutSizeOptions(pkgKey) {
    var sizeDst = document.getElementById("checkoutSize");
    if (!sizeDst) return;
    sizeDst.innerHTML = "";
    
    if (pkgKey === "3") {
      sizeDst.innerHTML = `
        <option value="8-9">مناسب من سن 8 إلى 9 سنوات</option>
        <option value="10-11">مناسب من سن 10 إلى 11 سنة</option>
        <option value="12">مناسب لسن 12 سنة</option>
      `;
    } else {
      sizeDst.innerHTML = `
        <option value="M">M — مناسب حتى 70 كيلو</option>
        <option value="L">L — مناسب من 70 إلى 80 كيلو</option>
        <option value="XL">XL — مناسب من 80 إلى 90 كيلو</option>
        <option value="2XL">2XL — مناسب من 90 إلى 105 كيلو</option>
      `;
    }
  }

  // الاستماع لتغيير الراديو يدوياً من داخل الفورم نفسه
  document.querySelectorAll('input[name="package"]').forEach(function(radio) {
    radio.addEventListener("change", function() {
      updateCheckoutSizeOptions(this.value);
      updateInvoice();
    });
  });


  /* تحديد عناصر الفاتورة الديناميكية */
  var invPkgLabel   = document.getElementById("invPkgLabel");
  var invPkgPrice   = document.getElementById("invPkgPrice");
  var invSize       = document.getElementById("invSize");
  var invShipping   = document.getElementById("invShipping");
  var invDiscountRow= document.getElementById("invDiscountRow");
  var invDiscount   = document.getElementById("invDiscount");
  var invTotal      = document.getElementById("invTotal");

  var checkoutSizeSelect = document.getElementById("checkoutSize");
  var governorateSelect  = document.getElementById("governorate");
  var quantityInput      = document.getElementById('quantity') || document.querySelector('.product-quantity');

  /* تفعيل أزرار الـ + والـ - للتحكم في الكمية */
  var minusBtn = document.querySelector(".quantity-btn.minus") || document.getElementById("minusBtn");
  var plusBtn = document.querySelector(".quantity-btn.plus") || document.getElementById("plusBtn");

  if (quantityInput) {
    if (minusBtn) {
      minusBtn.addEventListener("click", function() {
        var currentVal = parseInt(quantityInput.value) || 1;
        if (currentVal > 1) {
          quantityInput.value = currentVal - 1;
          quantityInput.dispatchEvent(new Event("change"));
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", function() {
        var currentVal = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentVal + 1;
        quantityInput.dispatchEvent(new Event("change"));
      });
    }
  }

  function getSelectedPackageKey(){
    var checked = document.querySelector('input[name="package"]:checked');
    return checked ? checked.value : "1";
  }

  function updateInvoice(){
    var key = getSelectedPackageKey();
    var pkg = PACKAGES[key];

    var quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) { quantity = 1; }

    // 1. حساب قيمة المنتجات بناءً على معادلة الخصم الجديدة للباقة الثانية
    var productsPrice = 0;
    var savedDiscount = 0;

    if (key === "2") {
      // تطبيق معادلة "عروض الأكثر من قطعة" الديناميكية
      if (quantity === 1) {
        productsPrice = 600; 
        savedDiscount = 0;
      } else if (quantity === 2) {
        productsPrice = 1100; // قطعتين بـ 1100 بدلاً من 1200
        savedDiscount = 100;
      } else if (quantity === 3) {
        productsPrice = 1500; // 3 قطع بـ 1500 بدلاً من 1800
        savedDiscount = 300;
      } else {
        // 4 قطع أو أكثر: 1500 لأول 3 قطع + 500 لكل قطعة إضافية
        productsPrice = 1500 + ((quantity - 3) * 500);
        savedDiscount = (quantity * 600) - productsPrice;
      }
    } else {
      // الباقة الأولى أو باقة الأطفال مضروبة في الكمية مباشرة
      productsPrice = pkg.price * quantity;
    }
    // 2. حساب تكلفة الشحن جغرافيًا بناءً على المحافظة
    var shippingCost = 0;
    var govValue = governorateSelect ? governorateSelect.value : "";

    if (!govValue) {
      if (invShipping) invShipping.textContent = "يُحسب عند اختيار المحافظة";
    } else {
      // إذا اختار الباقة الثانية وعدد القطع قطعتين فما فوق، الشحن مجاني بالكامل
      if (key === "2" && quantity >= 2) {
        shippingCost = 0;
        if (invShipping) invShipping.textContent = "شحن مجاني 🎁";
      } else {
        // الشحن العادي حسب الإقليم
        if (govValue === "القاهرة" || govValue === "الجيزة") {
          shippingCost = 80;
          if (invShipping) invShipping.textContent = "80 جنيه";
        } else {
          shippingCost = 120;
          if (invShipping) invShipping.textContent = "120 جنيه";
        }
      }
    }

    // 3. إضافة تكلفة خدمة الطباعة إذا تم تفعيلها
    var printingCost = 0;
    if (enablePrinting && enablePrinting.checked) {
      printingCost = 200;
    }

    // 4. حساب الإجمالي النهائي التام
    var totalFinal = productsPrice + shippingCost + printingCost;

    // تحديث البيانات على واجهة الشاشة والفاتورة الجانبية
    if (invPkgLabel) invPkgLabel.textContent = pkg.label + " (عدد: " + quantity + ")";
    if (invPkgPrice) invPkgPrice.textContent = productsPrice + " جنيه";
    if (invSize && checkoutSizeSelect) invSize.textContent = checkoutSizeSelect.value;

    if (savedDiscount > 0) {
      if (invDiscountRow) invDiscountRow.style.display = "flex";
      if (invDiscount) invDiscount.textContent = "– " + savedDiscount + " جنيه";
    } else {
      if (invDiscountRow) invDiscountRow.style.display = "none";
    }

    if (invTotal) invTotal.textContent = totalFinal + " جنيه";
    
    var totalValSpan = document.querySelector('.total-val');
    if (totalValSpan) totalValSpan.textContent = productsPrice; // إجمالي المنتجات المعروض داخل الفورم
  }

  // ربط أحداث الاستماع للتحديث اللحظي بالفاتورة
  if (checkoutSizeSelect) checkoutSizeSelect.addEventListener("change", updateInvoice);
  if (governorateSelect) governorateSelect.addEventListener("change", updateInvoice);
  
  if (quantityInput) {
    quantityInput.addEventListener("input", updateInvoice);
    quantityInput.addEventListener("change", updateInvoice);
  }

  updateInvoice();


  /* معالجة وإرسال نص الفاتورة الديناميكية للواتساب */
  var orderForm = document.getElementById("orderForm");
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");

  function showToast(message){
    if (toastMsg && toast) {
      toastMsg.textContent = message;
      toast.classList.add("show");
      setTimeout(function(){ toast.classList.remove("show"); }, 3800);
    }
  }

  function buildWhatsAppMessage(data){
    var lines = [];
    lines.push("🇪🇬 *طلب جديد — متجر العرب* 🇪🇬");
    lines.push("");
    lines.push("📦 *الباقة المختارة:* " + data.packageLabel);
    lines.push("🔢 *الكمية المطلوبة:* " + data.quantity);
    lines.push("🧾 *نوعية القطع:* " + data.packageItems);
    lines.push("📐 *المقاس / السن المطلوب:* " + data.size);
    
    // سطر الطباعة الديناميكي الجديد
    if (data.printingText) {
      lines.push("🔥 *المطلوب طباعته:* " + data.printingText);
    }
    
    lines.push("");
    lines.push("👤 *بيانات العميل المستلم*");
    lines.push("• الاسم بالكامل: " + data.name);
    lines.push("• رقم الهاتف الأساسي: " + data.primaryMobile);
    lines.push("• رقم الهاتف البديل: " + data.altMobile);
    lines.push("• المحافظة: " + data.governorate);
    lines.push("• العنوان بالتفصيل: " + data.address);
    lines.push("");
    lines.push("💰 *ملخص الحساب والدفع عند الاستلام*");
    lines.push("• قيمة المنتجات: " + data.subtotal + " جنيه");
    if (data.printingCost > 0) {
      lines.push("• تكلفة خدمة الطباعة: +" + data.printingCost + " جنيه");
    }
    lines.push("• تكلفة خدمة الشحن: " + data.shippingLabel);
    if (data.discount > 0) {
      lines.push("• قيمة الخصم الموفر: −" + data.discount + " جنيه 🎉");
    }
    lines.push("• *المبلغ الإجمالي المطلوب من المندوب: " + data.total + " جنيه مصري*");
    lines.push("");
    lines.push("✅ برجاء مراجعة البيانات وتأكيد تجهيز الطلبية للشحن الفوري.");
    lines.push("_أُرسلت هذه الرسالة تلقائياً من نظام متجر العرب الإلكتروني_");
    return lines.join("\n");
  }

  if (orderForm) {
    orderForm.addEventListener("submit", function(e){
      e.preventDefault();

      var fullName    = document.getElementById("fullName").value.trim();
      var primaryMobile = document.getElementById("primaryMobile").value.trim();
      var altMobile    = document.getElementById("altMobile").value.trim();
      var governorate  = document.getElementById("governorate").value;
      var address      = document.getElementById("address").value.trim();
      var size         = checkoutSizeSelect ? checkoutSizeSelect.value : "";
      var pkgKey       = getSelectedPackageKey();
      var pkg          = PACKAGES[pkgKey];

      var quantity = parseInt(quantityInput.value);
      if (isNaN(quantity) || quantity < 1) { quantity = 1; }

      if (!fullName || !primaryMobile || !altMobile || !governorate || !address) {
        showToast("يرجى ملء جميع الحقول المطلوبة أولاً.");
        return;
      }

      // إعادة حساب نفس القيم المدخلة للتأكيد قبل إرسال الرسالة
      var productsPrice = 0;
      var savedDiscount = 0;
      if (pkgKey === "2") {
        if (quantity === 1) productsPrice = 600;
        else if (quantity === 2) { productsPrice = 1100; savedDiscount = 100; }
        else if (quantity === 3) { productsPrice = 1500; savedDiscount = 300; }
        else {
          productsPrice = 1500 + ((quantity - 3) * 500);
          savedDiscount = (quantity * 600) - productsPrice;
        }
      } else {
        productsPrice = pkg.price * quantity;
      }

      var shippingCost = 0;
      var shippingLabel = "";
      if (pkgKey === "2" && quantity >= 2) {
        shippingCost = 0;
        shippingLabel = "مجاني بدون رسوم 🎁";
      } else {
        if (governorate === "القاهرة" || governorate === "الجيزة") {
          shippingCost = 80;
          shippingLabel = "80 جنيه";
        } else {
          shippingCost = 120;
          shippingLabel = "120 جنيه";
        }
      }

      var printingCost = 0;
      var printingTextValue = "";
      if (enablePrinting && enablePrinting.checked) {
        printingCost = 200;
        printingTextValue = printingTextInput ? printingTextInput.value.trim() : "";
        if (!printingTextValue) {
          printingTextValue = "تم تفعيل خدمة الطباعة (سيتم تأكيد الاسم والرقم مع الدعم)";
        }
      }

      var totalFinal = productsPrice + shippingCost + printingCost;

      var message = buildWhatsAppMessage({
        packageLabel: pkg.label,
        quantity: quantity,
        packageItems: pkg.items,
        size: size,
        printingText: printingTextValue,
        printingCost: printingCost,
        name: fullName,
        primaryMobile: primaryMobile,
        altMobile: altMobile,
        governorate: governorate,
        address: address,
        subtotal: productsPrice,
        shippingLabel: shippingLabel,
        discount: savedDiscount,
        total: totalFinal
      });

      var whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

      showToast("تم تجهيز طلبيتك بنجاح! جاري فتح الواتساب للتأكيد الفوري…");
      window.open(whatsappUrl, "_blank");
    });
  }

})();
// التأكد من تحميل كل عناصر الصفحة أولاً لمنع الـ null والرفع لأعلى
document.addEventListener("DOMContentLoaded", function() {
  
  var policyModal = document.getElementById("policyModal");
  var openPolicyBtn = document.getElementById("openPolicyBtn");
  var closePolicyBtn = document.getElementById("closePolicyBtn");
  var closePolicyBottomBtn = document.getElementById("closePolicyBottomBtn");

  if (openPolicyBtn && policyModal) {
    // تشغيل دالة الفتح عند الضغط
    openPolicyBtn.addEventListener("click", function(e) {
      e.preventDefault(); // منع المتصفح من رفع الصفحة لفوق
      policyModal.style.display = "flex";
    });

    // دالة الإغلاق
    function closePolicy(e) {
      if (e) e.preventDefault();
      policyModal.style.display = "none";
    }

    if (closePolicyBtn) closePolicyBtn.addEventListener("click", closePolicy);
    if (closePolicyBottomBtn) closePolicyBottomBtn.addEventListener("click", closePolicy);

    // إغلاق عند الضغط خارج المربع الأسود
    window.addEventListener("click", function(e) {
      if (e.target == policyModal) {
        closePolicy();
      }
    });
  } else {
    console.log("تنبيه: لم يتم العثور على زر السياسة أو النافذة المنبثقة في الـ HTML");
  }
  
});