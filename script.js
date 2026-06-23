(function(){
  "use strict";

  // رقم الواتساب الخاص بك
  var WHATSAPP_NUMBER = "201069086119";

  /* --- دوال السلايدر (ربط مباشر مع الـ HTML) --- */
  window.moveSlider = function(sliderId, direction) {
    var slider = document.getElementById(sliderId);
    if (!slider) return;
    var imgs = slider.getElementsByClassName("slider-img");
    if (imgs.length === 0) return;
    
    var activeIdx = 0;
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].classList.contains("active")) {
        activeIdx = i;
        imgs[i].classList.remove("active");
        break;
      }
    }
    var nextIdx = (activeIdx + direction + imgs.length) % imgs.length;
    imgs[nextIdx].classList.add("active");
  };

  window.moveGallerySlider = function(sliderId, direction) {
    var slider = document.getElementById(sliderId);
    if (!slider) return;
    var imgs = slider.getElementsByClassName("gallery-slider-img");
    if (imgs.length === 0) return;
    
    var activeIdx = 0;
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].classList.contains("active")) {
        activeIdx = i;
        imgs[i].classList.remove("active");
        break;
      }
    }
    var nextIdx = (activeIdx + direction + imgs.length) % imgs.length;
    imgs[nextIdx].classList.add("active");
  };

  /* --- التحكم في حقول الطباعة وإظهارها تفاعلياً --- */
  var printRoyalCheck = document.getElementById("printRoyalCheck");
  var printRoyalFields = document.getElementById("printRoyalFields");
  var printKidsCheck = document.getElementById("printKidsCheck");
  var printKidsFields = document.getElementById("printKidsFields");

  if (printRoyalCheck && printRoyalFields) {
    printRoyalCheck.addEventListener("change", function() {
      printRoyalFields.style.display = this.checked ? "block" : "none";
      if (!this.checked) {
        var txt = document.getElementById("printRoyalText");
        if (txt) txt.value = "";
      }
      updateInvoice();
    });
  }

  if (printKidsCheck && printKidsFields) {
    printKidsCheck.addEventListener("change", function() {
      printKidsFields.style.display = this.checked ? "block" : "none";
      if (!this.checked) {
        var txt = document.getElementById("printKidsText");
        if (txt) txt.value = "";
      }
      updateInvoice();
    });
  }

  /* --- تفعيل الـ Checkboxes للمقاسات وظهور العدادات --- */
  var sizeChecks = document.querySelectorAll(".size-multi-check");
  sizeChecks.forEach(function(chk) {
    chk.addEventListener("change", function() {
      var controls = this.parentElement.nextElementSibling;
      if (controls && controls.classList.contains("mini-qty-controls")) {
        if (this.checked) {
          controls.style.display = "inline-flex";
        } else {
          controls.style.display = "none";
          var inputVal = controls.querySelector(".mini-val");
          if (inputVal) inputVal.value = 1;
        }
      }
      updateInvoice();
    });
  });

  /* --- أزرار الزيادة والنقصان (+) و (-) للمقاسات --- */
  document.querySelectorAll(".mini-plus").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var input = this.parentElement.querySelector(".mini-val");
      if (input) {
        var val = parseInt(input.value) || 1;
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
        var val = parseInt(input.value) || 1;
        if (val > 1) {
          input.value = val - 1;
          updateInvoice();
        }
      }
    });
  });

  /* --- حساب الفاتورة الحية والتلقائية بالكامل --- */
  var invRoyalQty = document.getElementById("invRoyalQty");
  var invKidsQty  = document.getElementById("invKidsQty");
  var invSize     = document.getElementById("invSize");
  var invShipping = document.getElementById("invShipping");
  var invTotal    = document.getElementById("invTotal");
  var governorateSelect = document.getElementById("governorate");

  function updateInvoice() {
    var qtyRoyal = 0;
    var qtyKids = 0;
    var displaySizes = [];

    // تجميع الكبار
    document.querySelectorAll(".mini-val[data-type='royal']").forEach(function(input) {
      var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
      if (chk && chk.checked) {
        var qty = parseInt(input.value) || 0;
        qtyRoyal += qty;
        displaySizes.push("كبار (" + chk.getAttribute("data-size") + " × " + qty + ")");
      }
    });

    // تجميع الأطفال
    document.querySelectorAll(".mini-val[data-type='kids']").forEach(function(input) {
      var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
      if (chk && chk.checked) {
        var qty = parseInt(input.value) || 0;
        qtyKids += qty;
        displaySizes.push("صغار (سن " + chk.getAttribute("data-size").replace("من ", "").replace(" لـ ", "-") + " × " + qty + ")");
      }
    });

    if (invRoyalQty) invRoyalQty.textContent = qtyRoyal + " قطعة";
    if (invKidsQty) invKidsQty.textContent = qtyKids + " طقم";
    if (invSize) invSize.textContent = displaySizes.length > 0 ? displaySizes.join(" | ") : "لم يتم الاختيار";

    // حساب عروض أسعار المنتجات
    var priceRoyal = 0;
    var discountRoyal = 0;
    if (qtyRoyal === 1) priceRoyal = 600;
    else if (qtyRoyal === 2) { priceRoyal = 1100; discountRoyal = 100; }
    else if (qtyRoyal === 3) { priceRoyal = 1500; discountRoyal = 300; }
    else if (qtyRoyal > 3) { priceRoyal = 1500 + ((qtyRoyal - 3) * 500); discountRoyal = (qtyRoyal * 600) - priceRoyal; }

    var priceKids = 0;
    var discountKids = 0;
    if (qtyKids === 1) priceKids = 750;
    else if (qtyKids === 2) { priceKids = 1400; discountKids = 100; }
    else if (qtyKids === 3) { priceKids = 2050; discountKids = 200; }
    else if (qtyKids > 3) { priceKids = 2050 + ((qtyKids - 3) * 650); discountKids = (qtyKids * 750) - priceKids; }

    var subtotal = priceRoyal + priceKids;
    var totalDiscount = discountRoyal + discountKids;

    // حساب الشحن
    var shippingCost = 0;
    var gov = governorateSelect ? governorateSelect.value : "";
    if (gov) {
      if (gov === "القاهرة" || gov === "الجيزة") {
        shippingCost = 80;
        if (invShipping) invShipping.textContent = "80 جنيه";
      } else {
        shippingCost = 120;
        if (invShipping) invShipping.textContent = "120 جنيه";
      }
    } else {
      if (invShipping) invShipping.textContent = "اختار المحافظة";
    }

    // حساب خدمة الطباعة
    var printingCost = 0;
    if (printRoyalCheck && printRoyalCheck.checked) printingCost += (200 * qtyRoyal);
    if (printKidsCheck && printKidsCheck.checked) printingCost += (200 * qtyKids);

    var invPrintingPrice = document.getElementById("invPrintingPrice");
    if (invPrintingPrice) invPrintingPrice.textContent = "+ " + printingCost + " جنيه";

    var invDiscount = document.getElementById("invDiscount");
    if (invDiscount) invDiscount.textContent = totalDiscount + " جنيه";

    var finalTotal = subtotal + shippingCost + printingCost;
    if (invTotal) invTotal.textContent = (qtyRoyal + qtyKids > 0) ? finalTotal : "0";
  }

  if (governorateSelect) governorateSelect.addEventListener("change", updateInvoice);

  /* --- معالجة فورم الطلب وإرساله للواتساب بشكل آمن --- */
  var orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();

      var fullName = document.getElementById("fullName").value.trim();
      var primaryMobile = document.getElementById("primaryMobile").value.trim();
      var altMobile = document.getElementById("altMobile").value.trim();
      var governorate = governorateSelect ? governorateSelect.value : "";
      var address = document.getElementById("address").value.trim();

      var qtyRoyal = 0;
      var qtyKids = 0;
      var displaySizes = [];

      document.querySelectorAll(".mini-val[data-type='royal']").forEach(function(input) {
        var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
        if (chk && chk.checked) {
          var qty = parseInt(input.value) || 0;
          qtyRoyal += qty;
          displaySizes.push("كبار (" + chk.getAttribute("data-size") + " × " + qty + ")");
        }
      });

      document.querySelectorAll(".mini-val[data-type='kids']").forEach(function(input) {
        var chk = input.parentElement.parentElement.querySelector(".size-multi-check");
        if (chk && chk.checked) {
          var qty = parseInt(input.value) || 0;
          qtyKids += qty;
          // تحويل الصيغة البرمجية لتبدو "سن 8-10" بدلاً من النص الطويل داخل حقل الـ HTML
          var sizeLabel = chk.getAttribute("data-size").replace("من ", "").replace(" لـ ", "-");
          displaySizes.push("صغار (سن " + sizeLabel + " × " + qty + ")");
        }
      });

      if (qtyRoyal === 0 && qtyKids === 0) {
        alert("برجاء اختيار مقاس وكمية واحدة على الأقل أولاً!");
        return;
      }

      // حساب عروض الأسعار والخصومات الفورية لإدراجها بالرسالة
      var priceRoyal = 0;
      var discountRoyal = 0;
      if (qtyRoyal === 1) priceRoyal = 600;
      else if (qtyRoyal === 2) { priceRoyal = 1100; discountRoyal = 100; }
      else if (qtyRoyal === 3) { priceRoyal = 1500; discountRoyal = 300; }
      else if (qtyRoyal > 3) { priceRoyal = 1500 + ((qtyRoyal - 3) * 500); discountRoyal = (qtyRoyal * 600) - priceRoyal; }

      var priceKids = 0;
      var discountKids = 0;
      if (qtyKids === 1) priceKids = 750;
      else if (qtyKids === 2) { priceKids = 1400; discountKids = 100; }
      else if (qtyKids === 3) { priceKids = 2050; discountKids = 200; }
      else if (qtyKids > 3) { priceKids = 2050 + ((qtyKids - 3) * 650); discountKids = (qtyKids * 750) - priceKids; }

      var subtotal = priceRoyal + priceKids;
      var totalDiscount = discountRoyal + discountKids;
      var shippingCost = (governorate === "القاهرة" || governorate === "الجيزة") ? 80 : 120;
      
      var printingCost = 0;
      var printRoyalLabel = "❌ لا";
      if (printRoyalCheck && printRoyalCheck.checked && qtyRoyal > 0) {
        printingCost += (200 * qtyRoyal);
        var t = document.getElementById("printRoyalText");
        printRoyalLabel = "✅ نعم، الاسم والرقم: (" + (t && t.value.trim() ? t.value.trim() : "تأكيد مع الدعم") + ")";
      }

      var printKidsLabel = "❌ لا";
      if (printKidsCheck && printKidsCheck.checked && qtyKids > 0) {
        printingCost += (200 * qtyKids);
        var t = document.getElementById("printKidsText");
        printKidsLabel = "✅ نعم، الاسم والرقم: (" + (t && t.value.trim() ? t.value.trim() : "تأكيد مع الدعم") + ")";
      }

      var finalTotal = subtotal + shippingCost + printingCost;

      // بناء الرسالة المتطابقة تماماً مع طلبك بالرموز والخصومات التفصيلية المحدثة
      var msg = "🛍️ *طلب جديد — متجر العرب* 🛍️\n\n" +
                "👤 *بيانات العميل المستلم*\n" +
                "• الاسم بالكامل: " + fullName + "\n" +
                "• رقم الهاتف الأساسي: " + primaryMobile + "\n" +
                "• رقم الهاتف البديل: " + altMobile + "\n" +
                "• المحافظة: " + governorate + "\n" +
                "• العنوان بالتفصيل: " + address + "\n\n" +
                "📬 *تفاصيل المقاسات والأعمار المحددة:*\n" +
                "• [ " + displaySizes.join(" | ") + " ]\n" +
                "👕 طباعة طقم الكبار: " + printRoyalLabel + "\n" +
                "👶 طباعة طقم الأطفال: " + printKidsLabel + "\n\n" +
                "💰 *ملخص الحساب والدفع عند الاستلام*\n" +
                "• قيمة المنتجات: " + subtotal + " جنيه بدلاً من " + (subtotal + totalDiscount) + " جنيه\n" +
                "• تكلفة خدمة الطباعة: +" + printingCost + " جنيه\n" +
                "• تكلفة خدمة الشحن: " + shippingCost + " جنيه\n" +
                "• قيمة الخصم الموفر: −" + totalDiscount + " جنيه 🎁\n" +
                "• *المبلغ الإجمالي المطلوب من المندوب: " + finalTotal + " جنيه مصري*\n\n" +
                "⏳ برجاء مراجعة البيانات وتأكيد تجهيز الطلبية للشحن الفوري.\n" +
                "_أُرسلت هذه الرسالة تلقائياً من نظام متجر العرب الإلكتروني_";

      var toast = document.getElementById("toast");
      if (toast) toast.classList.add("show");

      // التوجيه فورا عبر السيرفر الرسمي للواتساب
      var targetUrl = "https://api.whatsapp.com/send?phone=" + WHATSAPP_NUMBER + "&text=" + encodeURIComponent(msg);
      window.location.href = targetUrl;
    });
  }

})();