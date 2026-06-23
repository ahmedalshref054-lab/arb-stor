(function(){
  "use strict";

  var WHATSAPP_NUMBER = "201069086119";

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

  /* ميزة خيارات الطباعة التفاعلية والمنفصلة كبار/أطفال */
  var printRoyalCheck = document.getElementById("printRoyalCheck");
  var printRoyalFields = document.getElementById("printRoyalFields");
  var printKidsCheck = document.getElementById("printKidsCheck");
  var printKidsFields = document.getElementById("printKidsFields");
  var invPrintingRow = document.getElementById("invPrintingRow");

  if (printRoyalCheck && printRoyalFields) {
    printRoyalCheck.addEventListener("change", function() {
      printRoyalFields.style.display = this.checked ? "block" : "none";
      if (!this.checked) {
        var royalText = document.getElementById("printRoyalText");
        if (royalText) royalText.value = "";
      }
      updateInvoice();
    });
  }

  if (printKidsCheck && printKidsFields) {
    printKidsCheck.addEventListener("change", function() {
      printKidsFields.style.display = this.checked ? "block" : "none";
      if (!this.checked) {
        var kidsText = document.getElementById("printKidsText");
        if (kidsText) kidsText.value = "";
      }
      updateInvoice();
    });
  }

  /* التحكم في إظهار حقول كميات المقاسات المصغرة بناءً على الـ Checkbox */
  var sizeChecks = document.querySelectorAll(".size-multi-check");
  sizeChecks.forEach(function(chk) {
    chk.addEventListener("change", function() {
      var miniQtyBox = this.parentElement.nextElementSibling;
      if (miniQtyBox) {
        if (this.checked) {
          miniQtyBox.style.display = "flex";
        } else {
          miniQtyBox.style.display = "none";
          var inputVal = miniQtyBox.querySelector(".mini-val");
          if (inputVal) inputVal.value = 1; 
        }
      }
      updateInvoice();
    });
  });

  /* تفعيل أزرار الـ + والـ - بداخل حقول المقاسات الفرعية */
  document.querySelectorAll(".mini-plus").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var input = this.parentElement.querySelector(".mini-val");
      if (input) {
        var val = parseInt(input.value) || 0;
        if (val < 10) { 
          input.value = val + 1;
          updateInvoice();
        }
      }
    });
  });

  document.querySelectorAll(".mini-minus").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var input = this.parentElement.querySelector(".mini-val");
      if (input) {
        var val = parseInt(input.value) || 0;
        if (val > 1) {
          input.value = val - 1;
          updateInvoice();
        }
      }
    });
  });

  /* تحديد عناصر الفاتورة الديناميكية والمحافظات */
  var invPkgLabel    = document.getElementById("invPkgLabel");
  var invPkgPrice    = document.getElementById("invPkgPrice");
  var invSize        = document.getElementById("invSize");
  var invShipping    = document.getElementById("invShipping");
  var invDiscountRow = document.getElementById("invDiscountRow");
  var invDiscount    = document.getElementById("invDiscount");
  var invTotal       = document.getElementById("invTotal");
  var governorateSelect = document.getElementById("governorate");

  function updateInvoice(){
    var quantityRoyal = 0;
    var quantityKids = 0;
    var displaySizes = [];

    // 1. حساب تجميعة كميات ومقاسات باقة الكبار الملكية
    document.querySelectorAll(".mini-val[data-type='royal']").forEach(function(input) {
      var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
      if (chk && chk.checked) {
        var qty = parseInt(input.value) || 0;
        quantityRoyal += qty;
        displaySizes.push("كبار (" + chk.getAttribute("data-size") + " × " + qty + ")");
      }
    });

    var cardQtyPkg2 = document.getElementById("cardQtyPkg2");
    if (cardQtyPkg2) cardQtyPkg2.value = quantityRoyal;

    var invRoyalQtyEl = document.getElementById("invRoyalQty");
    if (invRoyalQtyEl) invRoyalQtyEl.textContent = quantityRoyal + " قطعة";

    // 2. حساب تجميعة كميات وأعمار باقة الأطفال (الأشبال)
    document.querySelectorAll(".mini-val[data-type='kids']").forEach(function(input) {
      var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
      if (chk && chk.checked) {
        var qty = parseInt(input.value) || 0;
        quantityKids += qty;
        displaySizes.push("صغار (سن " + chk.getAttribute("data-size") + " × " + qty + ")");
      }
    });

    var cardQtyPkg3 = document.getElementById("cardQtyPkg3");
    if (cardQtyPkg3) cardQtyPkg3.value = quantityKids;

    var invKidsQtyEl = document.getElementById("invKidsQty");
    if (invKidsQtyEl) invKidsQtyEl.textContent = quantityKids + " طقم";

    // 3. تحديث خانة المقاسات بالفاتورة الجانبية
    if (invSize) {
      if (displaySizes.length > 0) {
        invSize.textContent = displaySizes.join(" | ");
      } else {
        invSize.textContent = "لم يتم تحديد كمية";
      }
    }

    // 4. حساب قيمة منتجات باقة الكبار مع الخصومات الأصلية
    var priceRoyalProducts = 0;
    var discountRoyal = 0;
    var originalRoyalPrice = quantityRoyal * 600;

    if (quantityRoyal === 1) {
      priceRoyalProducts = 600;
    } else if (quantityRoyal === 2) {
      priceRoyalProducts = 1100;
      discountRoyal = 100; 
    } else if (quantityRoyal === 3) {
      priceRoyalProducts = 1500;
      discountRoyal = 300; 
    } else if (quantityRoyal > 3) {
      priceRoyalProducts = 1500 + ((quantityRoyal - 3) * 500);
      discountRoyal = originalRoyalPrice - priceRoyalProducts;
    }

    // 5. حساب قيمة منتجات باقة الأطفال مع الخصومات الأصلية
    var priceKidsProducts = 0;
    var discountKids = 0;
    var originalKidsPrice = quantityKids * 750;

    if (quantityKids === 1) {
      priceKidsProducts = 750;
    } else if (quantityKids === 2) {
      priceKidsProducts = 1400;
      discountKids = 100; 
    } else if (quantityKids === 3) {
      priceKidsProducts = 2050;
      discountKids = 200; 
    } else if (quantityKids > 3) {
      priceKidsProducts = 2050 + ((quantityKids - 3) * 650);
      discountKids = originalKidsPrice - priceKidsProducts;
    }

    var totalProductsPrice = priceRoyalProducts + priceKidsProducts;
    var totalSavedDiscount = discountRoyal + discountKids;
    var totalOriginalPrice = originalRoyalPrice + originalKidsPrice;

    // 6. حساب تكلفة التوصيل (قاهرة وجيزة 80 / أي مكان تاني 120)
    var shippingCost = 0;
    var govValue = governorateSelect ? governorateSelect.value : "";

    if (!govValue) {
      if (invShipping) invShipping.textContent = "يُحسب عند اختيار المحافظة";
    } else {
      if (govValue === "القاهرة" || govValue === "الجيزة") {
        shippingCost = 80;
        if (invShipping) invShipping.textContent = "80 جنيه";
      } else {
        shippingCost = 120;
        if (invShipping) invShipping.textContent = "120 جنيه";
      }
    }

    // 7. حساب خدمة طباعة الأسماء
    var printingCost = 0;
    if (printRoyalCheck && printRoyalCheck.checked && quantityRoyal > 0) printingCost += (200 * quantityRoyal);
    if (printKidsCheck && printKidsCheck.checked && quantityKids > 0) printingCost += (200 * quantityKids);

    if (invPrintingRow) {
      var invPrintingPrice = document.getElementById("invPrintingPrice");
      if (printingCost > 0) {
        invPrintingRow.style.display = "flex";
        if (invPrintingPrice) invPrintingPrice.textContent = "+ " + printingCost + " جنيه";
      } else {
        invPrintingRow.style.display = "none";
      }
    }

    // 8. الأرقام النهائية وحقن كلمة "بدلاً من" في الفاتورة في حالة وجود خصم فعلي
    var totalFinal = totalProductsPrice + shippingCost + printingCost;

    if (invPkgLabel) invPkgLabel.textContent = "إجمالي الباقات المطلوبة";
    
    if (invPkgPrice) {
      if (totalSavedDiscount > 0) {
        invPkgPrice.textContent = totalProductsPrice + " جنيه بدلاً من " + totalOriginalPrice + " جنيه";
      } else {
        invPkgPrice.textContent = totalProductsPrice + " جنيه";
      }
    }

    if (totalSavedDiscount > 0) {
      if (invDiscountRow) invDiscountRow.style.display = "flex";
      if (invDiscount) invDiscount.textContent = "– " + totalSavedDiscount + " جنيه";
    } else {
      if (invDiscountRow) invDiscountRow.style.display = "none";
    }

    if (invTotal) invTotal.textContent = (quantityRoyal + quantityKids > 0) ? (totalFinal + " جنيه") : "0 جنيه";
    
    var totalValSpan = document.querySelector('.total-val');
    if (totalValSpan) totalValSpan.textContent = totalProductsPrice; 
  }

  if (governorateSelect) governorateSelect.addEventListener("change", updateInvoice);
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
    lines.push("👤 *بيانات العميل المستلم*");
    lines.push("• الاسم بالكامل: " + data.name);
    lines.push("• رقم الهاتف الأساسي: " + data.primaryMobile);
    lines.push("• رقم الهاتف البديل: " + data.altMobile);
    lines.push("• المحافظة: " + data.governorate);
    lines.push("• العنوان بالتفصيل: " + data.address);
    lines.push("");
    lines.push("📦 *تفاصيل المقاسات والأعمار المحددة:*");
    lines.push("• [ " + data.sizesText + " ]");
    
    if (data.qtyRoyal > 0 && data.isPrintRoyal) {
      lines.push("✍️ طباعة طقم الكبار: " + data.printRoyalLabel);
    }
    if (data.qtyKids > 0 && data.isPrintKids) {
      lines.push("✍️ طباعة طقم الأطفال: " + data.printKidsLabel);
    }
    
    lines.push("");
    lines.push("💰 *ملخص الحساب والدفع عند الاستلام*");
    
    if (data.discount > 0) {
      lines.push("• قيمة المنتجات: " + data.subtotal + " جنيه بدلاً من " + data.originalPrice + " جنيه");
    } else {
      lines.push("• قيمة المنتجات: " + data.subtotal + " جنيه");
    }

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

      var quantityRoyal = 0;
      var quantityKids = 0;
      var displaySizes = [];

      document.querySelectorAll(".mini-val[data-type='royal']").forEach(function(input) {
        var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
        if (chk && chk.checked) {
          var qty = parseInt(input.value) || 0;
          quantityRoyal += qty;
          displaySizes.push("كبار (" + chk.getAttribute("data-size") + " × " + qty + ")");
        }
      });

      document.querySelectorAll(".mini-val[data-type='kids']").forEach(function(input) {
        var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
        if (chk && chk.checked) {
          var qty = parseInt(input.value) || 0;
          quantityKids += qty;
          displaySizes.push("صغار (سن " + chk.getAttribute("data-size") + " × " + qty + ")");
        }
      });

      if (quantityRoyal === 0 && quantityKids === 0) {
        showToast("عفواً، يرجى اختيار مقاس وكمية قطعة واحدة على الأقل لإتمام طلبك.");
        return;
      }

      if (!fullName || !primaryMobile || !altMobile || !governorate || !address) {
        showToast("يرجى ملء جميع الحقول المطلوبة أولاً.");
        return;
      }

      var priceRoyalProducts = 0;
      var discountRoyal = 0;
      var originalRoyalPrice = quantityRoyal * 600;

      if (quantityRoyal === 1) priceRoyalProducts = 600;
      else if (quantityRoyal === 2) { priceRoyalProducts = 1100; discountRoyal = 100; }
      else if (quantityRoyal === 3) { priceRoyalProducts = 1500; discountRoyal = 300; }
      else if (quantityRoyal > 3) {
        priceRoyalProducts = 1500 + ((quantityRoyal - 3) * 500);
        discountRoyal = originalRoyalPrice - priceRoyalProducts;
      }

      var priceKidsProducts = 0;
      var discountKids = 0;
      var originalKidsPrice = quantityKids * 750;

      if (quantityKids === 1) priceKidsProducts = 750;
      else if (quantityKids === 2) { priceKidsProducts = 1400; discountKids = 100; }
      else if (quantityKids === 3) { priceKidsProducts = 2050; discountKids = 200; }
      else if (quantityKids > 3) {
        priceKidsProducts = 2050 + ((quantityKids - 3) * 650);
        discountKids = originalKidsPrice - priceKidsProducts;
      }

      var productsPrice = priceRoyalProducts + priceKidsProducts;
      var savedDiscount = discountRoyal + discountKids;
      var totalOriginalPrice = originalRoyalPrice + originalKidsPrice;

      var shippingCost = 0;
      if (governorate === "القاهرة" || governorate === "الجيزة") {
        shippingCost = 80;
      } else {
        shippingCost = 120;
      }

      var printingCost = 0;
      var printRoyalLabel = "❌ غير مفعلة";
      var isPrintRoyal = false;
      if (printRoyalCheck && printRoyalCheck.checked && quantityRoyal > 0) {
        isPrintRoyal = true;
        printingCost += (200 * quantityRoyal);
        var rText = document.getElementById("printRoyalText") ? document.getElementById("printRoyalText").value.trim() : "";
        printRoyalLabel = "✅ نعم، الاسم والرقم: (" + (rText ? rText : "سيتم تأكيده مع الدعم") + ")";
      }

      var printKidsLabel = "❌ غير مفعلة";
      var isPrintKids = false;
      if (printKidsCheck && printKidsCheck.checked && quantityKids > 0) {
        isPrintKids = true;
        printingCost += (200 * quantityKids);
        var kText = document.getElementById("printKidsText") ? document.getElementById("printKidsText").value.trim() : "";
        printKidsLabel = "✅ نعم، الاسم والرقم: (" + (kText ? kText : "سيتم تأكيده مع الدعم") + ")";
      }

      var totalFinal = productsPrice + shippingCost + printingCost;
      var sizesText = displaySizes.join(" | ");

      var message = buildWhatsAppMessage({
        qtyRoyal: quantityRoyal,
        qtyKids: quantityKids,
        sizesText: sizesText,
        isPrintRoyal: isPrintRoyal,
        isPrintKids: isPrintKids,
        printRoyalLabel: printRoyalLabel,
        printKidsLabel: printKidsLabel,
        printingCost: printingCost,
        name: fullName,
        primaryMobile: primaryMobile,
        altMobile: altMobile,
        governorate: governorate,
        address: address,
        subtotal: productsPrice,
        originalPrice: totalOriginalPrice,
        shippingLabel: shippingCost + " جنيه",
        discount: savedDiscount,
        total: totalFinal
      });

      var whatsappUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

      showToast("تم تجهيز طلبيتك بنجاح! جاري فتح الواتساب للتأكيد الفوري…");
      window.open(whatsappUrl, "_blank");
    });
  }

})();

document.addEventListener("DOMContentLoaded", function() {
  var policyModal = document.getElementById("policyModal");
  var openPolicyBtn = document.getElementById("openPolicyBtn");
  var closePolicyBtn = document.getElementById("closePolicyBtn");
  var closePolicyBottomBtn = document.getElementById("closePolicyBottomBtn");

  if (openPolicyBtn && policyModal) {
    openPolicyBtn.addEventListener("click", function(e) {
      e.preventDefault(); 
      policyModal.style.display = "flex";
    });

    function closePolicy(e) {
      if (e) e.preventDefault();
      policyModal.style.display = "none";
    }

    if (closePolicyBtn) closePolicyBtn.addEventListener("click", closePolicy);
    if (closePolicyBottomBtn) closePolicyBottomBtn.addEventListener("click", closePolicy);

    window.addEventListener("click", function(e) {
      if (e.target == policyModal) {
        closePolicy();
      }
    });
  }
});