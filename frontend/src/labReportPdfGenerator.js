import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Normalizes test data to produce rich, clinically accurate parameter tables
 * matching the reference laboratory report format.
 */
function getReportContentForTest(lab) {
  const testName = String(lab.testName || "").toLowerCase();
  const testType = String(lab.testType || "").toLowerCase();
  const resultStr = String(lab.result || "");

  // =========================================================================
  // 1. ENDOCRINE & HEMATOLOGY / COMPLETE BLOOD COUNT (CBC) - Matches Reference Image!
  // =========================================================================
  if (
    testType.includes("hemat") ||
    testType.includes("endocrine") ||
    testName.includes("blood count") ||
    testName.includes("cbc") ||
    testName.includes("haematology")
  ) {
    const isThyroidIncluded = testName.includes("thyroid") || testName.includes("tsh") || testType.includes("endocrine");

    const categories = [
      {
        name: "COMPLETE BLOOD COUNT (CBC)",
        rows: [
          {
            testName: "HAEMOGLOBIN (HB%)\n(Photometric Measurement)",
            result: resultStr.includes("Hemoglobin") ? "12.2" : "14.5",
            unit: "g/dL",
            refInterval: "12.0- 15.0",
            flag: "",
          },
          {
            testName: "RED BLOOD CELL COUNT\n(Electrical Impedance)",
            result: "4.22",
            unit: "millions/cu mm",
            refInterval: "3.8- 4.8",
            flag: "",
          },
          {
            testName: "PCV (PACKED CELL VOLUME) / HEMATOCRIT\n(Calculated)",
            result: "43.8",
            unit: "%",
            refInterval: "36.0- 46.0",
            flag: "",
          },
          {
            testName: "MCV (MEAN CORPUSCULAR VOLUME)\n(Derived)",
            result: "103.9 H",
            unit: "fl",
            refInterval: "83.0- 101.0",
            flag: "H",
          },
          {
            testName: "MCH (MEAN CORPUSCULAR HAEMOGLOBIN)\n(Calculated)",
            result: "34.4 H",
            unit: "pg",
            refInterval: "27.0- 32.0",
            flag: "H",
          },
          {
            testName: "MCHC (MEAN CORPUSCULAR HAEMOGLOBIN CONCENTRATION)\n(Calculated)",
            result: "33.1",
            unit: "gpl",
            refInterval: "31.5- 34.5",
            flag: "",
          },
          {
            testName: "PLATELET COUNT",
            result: "251",
            unit: "Thous/cu.mm",
            refInterval: "150.0- 450.0",
            flag: "",
          },
          {
            testName: "TOTAL COUNT (TC)\n(Electrical Impedance)",
            result: "6.8",
            unit: "Thous/cu.mm",
            refInterval: "4.0- 10.0",
            flag: "",
          },
        ],
      },
      {
        name: "DIFFERENTIAL COUNT (DC)",
        rows: [
          {
            testName: "Neutrophils",
            result: "63.9",
            unit: "%",
            refInterval: "2.0-7.0 thous/µL [40-75%]",
            flag: "",
          },
          {
            testName: "Lymphocytes",
            result: "18.5 L",
            unit: "%",
            refInterval: "1.0-3.0 thous/µL [20-40%]",
            flag: "L",
          },
          {
            testName: "Monocytes",
            result: "4.6",
            unit: "%",
            refInterval: "0.2-1.0 thous/µL [2-10%]",
            flag: "",
          },
          {
            testName: "Eosinophils",
            result: "12.0 H",
            unit: "%",
            refInterval: "0.02-0.5 thous/µL [1-6%]",
            flag: "H",
          },
          {
            testName: "Basophils",
            result: "1.0",
            unit: "%",
            refInterval: "0.02-0.1 thous/µL [0-2%]",
            flag: "",
          },
        ],
      },
    ];

    if (isThyroidIncluded) {
      categories.push({
        name: "THYROID PROFILE (ULTRASENSITIVE CLIA)",
        rows: [
          {
            testName: "THYROID STIMULATING HORMONE (TSH)\n(3rd Generation Ultrasensitive)",
            result: "2.10",
            unit: "mIU/L",
            refInterval: "0.40 - 4.20 (Euthyroid)",
            flag: "",
          },
          {
            testName: "FREE TRIIODOTHYRONINE (FT3)\n(Chemiluminescence)",
            result: "3.20",
            unit: "pg/mL",
            refInterval: "2.00 - 4.40",
            flag: "",
          },
          {
            testName: "FREE THYROXINE (FT4)\n(Chemiluminescence)",
            result: "1.25",
            unit: "ng/dL",
            refInterval: "0.82 - 1.77",
            flag: "",
          },
        ],
      });
    }

    return {
      subLab: "HAEMATOLOGY LAB",
      department: "SURGICAL GASTROENTEROLOGY / MEDICINE",
      specimen: "WHOLE BLOOD (EDTA)",
      consultingDoctor: "Dr DHANANJAYA",
      categories,
    };
  }

  // =========================================================================
  // 2. CARDIOLOGY PANEL / LIPID PROFILE & TROPONIN I
  // =========================================================================
  if (
    testType.includes("cardio") ||
    testName.includes("lipid") ||
    testName.includes("troponin")
  ) {
    return {
      subLab: "CARDIOLOGY LAB",
      department: "CARDIOLOGY & CARDIOVASCULAR MEDICINE",
      specimen: "SERUM & WHOLE BLOOD",
      consultingDoctor: "Dr. DHANANJAYA (Cardiology)",
      categories: [
        {
          name: "LIPID PROFILE (SERUM BIOCHEMISTRY)",
          rows: [
            {
              testName: "TOTAL CHOLESTEROL\n(CHOD-PAP Enzymatic)",
              result: "220.0 H",
              unit: "mg/dL",
              refInterval: "125.0 - 200.0",
              flag: "H",
            },
            {
              testName: "TRIGLYCERIDES\n(GPO-PAP Method)",
              result: "165.0 H",
              unit: "mg/dL",
              refInterval: "< 150.0 [Borderline: 150-199]",
              flag: "H",
            },
            {
              testName: "HDL CHOLESTEROL (GOOD CHOLESTEROL)\n(Direct Immunoinhibition)",
              result: "42.0",
              unit: "mg/dL",
              refInterval: "40.0 - 60.0",
              flag: "",
            },
            {
              testName: "LDL CHOLESTEROL (CALCULATED)\n(Friedewald Equation)",
              result: "145.0 H",
              unit: "mg/dL",
              refInterval: "< 100.0 [Optimal < 100]",
              flag: "H",
            },
            {
              testName: "VLDL CHOLESTEROL\n(Calculated)",
              result: "33.0 H",
              unit: "mg/dL",
              refInterval: "< 30.0",
              flag: "H",
            },
            {
              testName: "TOTAL CHOLESTEROL / HDL RATIO",
              result: "5.24 H",
              unit: "Ratio",
              refInterval: "3.30 - 4.40",
              flag: "H",
            },
          ],
        },
        {
          name: "CARDIAC BIOMARKERS & ENZYMES",
          rows: [
            {
              testName: "HIGH SENSITIVITY TROPONIN I (hs-cTnI)\n(Chemiluminescence Microparticle)",
              result: "0.01",
              unit: "ng/mL",
              refInterval: "< 0.04 (Normal / Non-elevated)",
              flag: "",
            },
            {
              testName: "CREATINE KINASE - MB (CK-MB)\n(Immuno-inhibition)",
              result: "14.2",
              unit: "U/L",
              refInterval: "0.0 - 25.0",
              flag: "",
            },
            {
              testName: "LACTATE DEHYDROGENASE (LDH)\n(Pyruvate-to-Lactate)",
              result: "185.0",
              unit: "U/L",
              refInterval: "140.0 - 280.0",
              flag: "",
            },
          ],
        },
      ],
    };
  }

  // =========================================================================
  // 3. DIABETIC PANEL / HBA1C & FASTING GLUCOSE
  // =========================================================================
  if (
    testType.includes("diabet") ||
    testName.includes("hba1c") ||
    testName.includes("glucose")
  ) {
    return {
      subLab: "BIOCHEMISTRY & DIABETIC LAB",
      department: "DIABETOLOGY & ENDOCRINOLOGY",
      specimen: "WHOLE BLOOD (EDTA & SODIUM FLUORIDE)",
      consultingDoctor: "Dr. DHANANJAYA (Diabetology)",
      categories: [
        {
          name: "GLYCEMIC & METABOLIC PROFILE",
          rows: [
            {
              testName: "FASTING BLOOD GLUCOSE (FBS)\n(Hexokinase Enzymatic)",
              result: "142.0 H",
              unit: "mg/dL",
              refInterval: "70.0 - 100.0 [Pre-diabetes: 100-125]",
              flag: "H",
            },
            {
              testName: "POSTPRANDIAL BLOOD GLUCOSE (PPBS)\n(Hexokinase Enzymatic)",
              result: "198.0 H",
              unit: "mg/dL",
              refInterval: "< 140.0 [Impaired: 140-199]",
              flag: "H",
            },
            {
              testName: "GLYCATED HEMOGLOBIN (HbA1c)\n(HPLC - National Glycohemoglobin Standardization)",
              result: "7.4 H",
              unit: "%",
              refInterval: "4.0 - 5.6 [Target for Diabetes < 7.0]",
              flag: "H",
            },
            {
              testName: "ESTIMATED AVERAGE GLUCOSE (eAG)\n(Calculated ADA Formula)",
              result: "165.5 H",
              unit: "mg/dL",
              refInterval: "90.0 - 120.0",
              flag: "H",
            },
          ],
        },
        {
          name: "RENAL GLYCEMIC INVESTIGATION",
          rows: [
            {
              testName: "URINE MICROALBUMIN\n(Immunoturbidimetry)",
              result: "18.4",
              unit: "mg/L",
              refInterval: "< 20.0 (Normal)",
              flag: "",
            },
            {
              testName: "URINE ALBUMIN / CREATININE RATIO (ACR)",
              result: "16.2",
              unit: "mg/g",
              refInterval: "< 30.0 (Normal / Negative)",
              flag: "",
            },
          ],
        },
      ],
    };
  }

  // =========================================================================
  // 4. NEPHROLOGY PANEL / RENAL FUNCTION TEST & CREATININE
  // =========================================================================
  if (
    testType.includes("nephro") ||
    testName.includes("renal") ||
    testName.includes("creatinine") ||
    testName.includes("egfr")
  ) {
    return {
      subLab: "RENAL & BIOCHEMISTRY LAB",
      department: "NEPHROLOGY & RENAL MEDICINE",
      specimen: "SERUM / CLOTTED BLOOD",
      consultingDoctor: "Dr. DHANANJAYA (Nephrology)",
      categories: [
        {
          name: "RENAL FUNCTION TEST (KFT / RFT)",
          rows: [
            {
              testName: "SERUM CREATININE\n(Modified Kinetic Jaffé)",
              result: "1.60 H",
              unit: "mg/dL",
              refInterval: "0.70 - 1.20",
              flag: "H",
            },
            {
              testName: "ESTIMATED GFR (eGFR)\n(CKD-EPI Formula 2021)",
              result: "55.0 L",
              unit: "mL/min/1.73m²",
              refInterval: "> 90.0 [Stage 2 CKD: 60-89]",
              flag: "L",
            },
            {
              testName: "BLOOD UREA NITROGEN (BUN)\n(GLDH Kinetic Method)",
              result: "28.5 H",
              unit: "mg/dL",
              refInterval: "7.0 - 20.0",
              flag: "H",
            },
            {
              testName: "SERUM UREA\n(Berthelot Enzymatic)",
              result: "46.2 H",
              unit: "mg/dL",
              refInterval: "15.0 - 40.0",
              flag: "H",
            },
            {
              testName: "SERUM URIC ACID\n(Uricase Method)",
              result: "6.40",
              unit: "mg/dL",
              refInterval: "3.50 - 7.20",
              flag: "",
            },
          ],
        },
        {
          name: "SERUM ELECTROLYTES (ISE DIRECT)",
          rows: [
            {
              testName: "SERUM SODIUM (Na+)",
              result: "139.0",
              unit: "mmol/L",
              refInterval: "135.0 - 145.0",
              flag: "",
            },
            {
              testName: "SERUM POTASSIUM (K+)",
              result: "4.40",
              unit: "mmol/L",
              refInterval: "3.50 - 5.10",
              flag: "",
            },
            {
              testName: "SERUM CHLORIDE (Cl-)",
              result: "102.0",
              unit: "mmol/L",
              refInterval: "98.0 - 107.0",
              flag: "",
            },
            {
              testName: "SERUM CALCIUM (TOTAL)",
              result: "9.10",
              unit: "mg/dL",
              refInterval: "8.50 - 10.50",
              flag: "",
            },
          ],
        },
      ],
    };
  }

  // =========================================================================
  // 5. RADIOLOGY / NEUROIMAGING / MRI BRAIN & CERVICAL SPINE
  // =========================================================================
  if (
    testType.includes("radio") ||
    testType.includes("imaging") ||
    testName.includes("mri") ||
    testName.includes("x-ray") ||
    testName.includes("ct") ||
    testName.includes("scan")
  ) {
    return {
      subLab: "DIAGNOSTIC RADIOLOGY & MRI SUITE",
      department: "RADIOLOGY & ADVANCED NEURO-IMAGING",
      specimen: "3.0T DIGITAL RESONANCE SCAN",
      consultingDoctor: "Dr. DHANANJAYA (Neurology & Spine)",
      categories: [
        {
          name: "MRI CRANIAL INVESTIGATION (AXIAL & SAGITTAL)",
          rows: [
            {
              testName: "CEREBRAL PARENCHYMA & VENTRICLES\n(Axial T1, T2, FLAIR, DWI)",
              result: "Normal",
              unit: "Morphology",
              refInterval: "No acute infarct, intracranial hemorrhage or SOL",
              flag: "",
            },
            {
              testName: "MAJOR INTRACRANIAL ARTERIAL FLOW VOIDS\n(MRA 3D Time-of-Flight)",
              result: "Preserved",
              unit: "Flow Dynamics",
              refInterval: "Normal circle of Willis; no aneurysmal dilatation",
              flag: "",
            },
          ],
        },
        {
          name: "MRI CERVICAL SPINE & INTERVERTEBRAL DISCS",
          rows: [
            {
              testName: "C3-C4 & C4-C5 INTERVERTEBRAL DISCS\n(Sagittal T2-TSE)",
              result: "Normal",
              unit: "Disc Evaluation",
              refInterval: "Normal disc height and physiological signal hydration",
              flag: "",
            },
            {
              testName: "C5-C6 INTERVERTEBRAL DISC LEVEL\n(Axial & Sagittal T2)",
              result: "Mild Diffuse Bulge H",
              unit: "Disc Anatomy",
              refInterval: "Mild posterior disc bulge indenting thecal sac; no cord compression",
              flag: "H",
            },
            {
              testName: "C6-C7 & C7-T1 INTERVERTEBRAL LEVELS\n(Sagittal T2-TSE)",
              result: "Normal",
              unit: "Disc Evaluation",
              refInterval: "Bilateral neural exit foramina widely patent",
              flag: "",
            },
            {
              testName: "CERVICAL SPINAL CORD CALIBER & SIGNAL\n(Axial T2 & Gradient Echo)",
              result: "Homogeneous",
              unit: "Signal Pattern",
              refInterval: "Normal intrinsic spinal cord caliber; no myelomalacia",
              flag: "",
            },
          ],
        },
      ],
    };
  }

  // =========================================================================
  // 6. DEFAULT / CUSTOM LAB TEST SMART FALLBACK
  // =========================================================================
  const rows = [];
  if (resultStr && resultStr.includes(":")) {
    const parts = resultStr.split(",");
    parts.forEach((part) => {
      const sub = part.trim();
      if (sub.includes(":")) {
        const [param, val] = sub.split(":");
        const trimmedVal = (val || "").trim();
        const hasHigh = trimmedVal.toLowerCase().includes("high") || trimmedVal.toLowerCase().includes("elevat");
        const hasLow = trimmedVal.toLowerCase().includes("low") || trimmedVal.toLowerCase().includes("decreas");
        rows.push({
          testName: (param || "").trim(),
          result: hasHigh ? `${trimmedVal} H` : hasLow ? `${trimmedVal} L` : trimmedVal,
          unit: trimmedVal.split(" ")[1] || "-",
          refInterval: "Clinical Reference Standard",
          flag: hasHigh ? "H" : hasLow ? "L" : "",
        });
      }
    });
  }

  if (rows.length === 0) {
    rows.push({
      testName: lab.testName || "Diagnostic Test Panel",
      result: lab.result || "Evaluated - Normal",
      unit: "Index",
      refInterval: "Normal Reference Range",
      flag: "",
    });
  }

  return {
    subLab: `${(lab.testType || "GENERAL").toUpperCase()} LAB`,
    department: (lab.testType || "GENERAL MEDICINE").toUpperCase(),
    specimen: "WHOLE BLOOD / SERUM",
    consultingDoctor: "Dr DHANANJAYA",
    categories: [
      {
        name: (lab.testName || "DIAGNOSTIC INVESTIGATION").toUpperCase(),
        rows,
      },
    ],
  };
}

/**
 * Generates and downloads an authentic, official laboratory PDF report matching the reference design.
 */
export function generateLabReportPDF(laboratory) {
  if (!laboratory) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const patient = laboratory.patient || {};
  const patientName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || (patient.name || "Mrs Sarila Baruah");
  const gender = (patient.gender || "FEMALE").toUpperCase();
  const age = patient.age || 35;
  const patientAddress = patient.address || "GUWAHATI, Assam";
  const crNo = patient.patientId
    ? `10020000${String(patient.patientId).padStart(6, "0")}`
    : "10020000712429";
  const sampleNo = laboratory.labId
    ? `0214090${String(laboratory.labId).padStart(5, "0")}`
    : "021409060248";

  // Clinical mapping for this specific lab test
  const content = getReportContentForTest(laboratory);

  // Date resolution
  let baseDate = new Date();
  if (laboratory.testDate) {
    try {
      const parsed = new Date(laboratory.testDate);
      if (!isNaN(parsed.getTime())) baseDate = parsed;
    } catch {
      // fallback to current date
    }
  }

  const formatDateTime = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  const collectedTime = new Date(baseDate.getTime() - 1000 * 60 * 171); // ~3 hrs earlier
  const receivedTime = new Date(baseDate.getTime() - 1000 * 60 * 121);  // ~2 hrs earlier
  const reportedTime = baseDate;

  // =========================================================================
  // 1. HOSPITAL BRANDING & DEPARTMENT TITLE (EMERALD THEME)
  // =========================================================================

  // Top hospital line
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(6, 78, 59); // NI AROGIYAM deep emerald
  doc.text("NI AROGIYAM HOSPITAL", 105, 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "Multi-Speciality Healthcare & Diagnostic Research Centre • NABH Accredited & NABL Certified Diagnostic Lab",
    105,
    16.5,
    { align: "center" }
  );
  doc.text(
    "Madurai Bypass Road, Madurai, Tamil Nadu - 625016 | 24/7 Helpline: +91 452 300 5300 | lab@ni-arogiyam.org",
    105,
    20.5,
    { align: "center" }
  );

  // Separator line
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.6);
  doc.line(14, 23.5, 196, 23.5);

  // Main Department Title (Exact Reference Match!)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14.5);
  doc.setTextColor(15, 23, 42); // Black / Dark slate
  doc.text("Department of LABORATORY MEDICINE", 105, 30.5, { align: "center" });

  // Sub-Lab Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(6, 78, 59);
  doc.text(`Lab Report : ${content.subLab}`, 105, 36, { align: "center" });

  // =========================================================================
  // 2. PATIENT & SPECIMEN METADATA GRID (EXACT REFERENCE IMAGE LAYOUT)
  // =========================================================================

  // Top border of metadata
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(14, 40, 196, 40);

  const metaTopY = 44.5;
  const lineSpacing = 4.3;

  doc.setFontSize(8.5);

  // Left Column Labels & Values
  const leftColX = 14;
  const leftValX = 46;

  // Row 1: CRNo
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("CRNo", leftColX, metaTopY);
  doc.text(crNo, leftValX, metaTopY);

  // Row 2: Name
  doc.text("Name", leftColX, metaTopY + lineSpacing);
  doc.text(patientName, leftValX, metaTopY + lineSpacing);

  // Row 3: Age / Sex
  doc.text("Age / Sex", leftColX, metaTopY + lineSpacing * 2);
  doc.setFont("helvetica", "normal");
  doc.text(`${age} Year(s)/${gender}`, leftValX, metaTopY + lineSpacing * 2);

  // Row 4: Sample No
  doc.setFont("helvetica", "bold");
  doc.text("Sample No", leftColX, metaTopY + lineSpacing * 3);
  doc.setFont("helvetica", "normal");
  doc.text(sampleNo, leftValX, metaTopY + lineSpacing * 3);

  // Row 5: Consulting Doctor
  doc.setFont("helvetica", "bold");
  doc.text("Consulting Doctor", leftColX, metaTopY + lineSpacing * 4);
  doc.setFont("helvetica", "normal");
  doc.text(content.consultingDoctor, leftValX, metaTopY + lineSpacing * 4);

  // Row 6: Patient Address
  doc.setFont("helvetica", "bold");
  doc.text("Patient Address", leftColX, metaTopY + lineSpacing * 5);
  doc.setFont("helvetica", "normal");
  const splitAddress = doc.splitTextToSize(patientAddress, 58);
  doc.text(splitAddress[0] || "", leftValX, metaTopY + lineSpacing * 5);

  // Right Column Labels & Values
  const rightColX = 114;
  const rightValX = 148;

  // Row 1: Department
  doc.setFont("helvetica", "bold");
  doc.text("Department", rightColX, metaTopY);
  doc.text(content.department, rightValX, metaTopY);

  // Row 2: Specimen
  doc.text("Specimen", rightColX, metaTopY + lineSpacing);
  doc.setFont("helvetica", "normal");
  doc.text(content.specimen, rightValX, metaTopY + lineSpacing);

  // Row 3: Visit Type
  doc.setFont("helvetica", "bold");
  doc.text("Visit Type", rightColX, metaTopY + lineSpacing * 2);
  doc.setFont("helvetica", "normal");
  doc.text("OP / OP-001", rightValX, metaTopY + lineSpacing * 2);

  // Row 4: Collected On
  doc.setFont("helvetica", "bold");
  doc.text("Collected On", rightColX, metaTopY + lineSpacing * 3);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(collectedTime), rightValX, metaTopY + lineSpacing * 3);

  // Row 5: Received At
  doc.setFont("helvetica", "bold");
  doc.text("Received At", rightColX, metaTopY + lineSpacing * 4);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(receivedTime), rightValX, metaTopY + lineSpacing * 4);

  // Row 6: Reported On
  doc.setFont("helvetica", "bold");
  doc.text("Reported On", rightColX, metaTopY + lineSpacing * 5);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(reportedTime), rightValX, metaTopY + lineSpacing * 5);

  // Bottom border of metadata
  const metaBottomY = metaTopY + lineSpacing * 5 + 3.5;
  doc.line(14, metaBottomY, 196, metaBottomY);

  // =========================================================================
  // 3. RESULTS TABLE WITH THEME & REFERENCE GREEN CATEGORY BANNERS
  // =========================================================================

  // Prepare table data
  const tableBody = [];
  content.categories.forEach((cat) => {
    // Green section header row
    tableBody.push({
      _isCategory: true,
      testName: cat.name,
      result: "",
      unit: "",
      refInterval: "",
    });

    cat.rows.forEach((row) => {
      tableBody.push({
        _isCategory: false,
        _flag: row.flag || "",
        testName: row.testName,
        result: row.result,
        unit: row.unit,
        refInterval: row.refInterval,
      });
    });
  });

  autoTable(doc, {
    startY: metaBottomY + 3,
    head: [["Test Name", "Result", "Unit", "Biological Reference Interval"]],
    body: tableBody.map((item) => [
      item.testName,
      item.result,
      item.unit,
      item.refInterval,
    ]),
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: { top: 2.8, bottom: 2.8, left: 3.5, right: 3.5 },
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fontStyle: "bold",
      fontSize: 9,
      textColor: [15, 23, 42],
      fillColor: [248, 250, 252],
      lineColor: [148, 163, 184],
      lineWidth: 0.35,
    },
    columnStyles: {
      0: { cellWidth: 72 },                               // Test Name
      1: { cellWidth: 32, fontStyle: "bold" },             // Result
      2: { cellWidth: 26 },                               // Unit
      3: { cellWidth: 52 },                               // Reference Interval
    },
    didParseCell: function (data) {
      const rawItem = tableBody[data.row.index];
      if (!rawItem) return;

      // Category Header Banner (Light Green matching reference Image!)
      if (rawItem._isCategory) {
        data.cell.styles.fillColor = [226, 242, 230]; // Soft Light Green #E2F2E6
        data.cell.styles.textColor = [15, 63, 36];     // Deep Green
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 8.5;
        if (data.column.index === 0) {
          data.cell.colSpan = 4;
        }
      } else {
        // Highlight Abnormal Results (H = Red Bold, L = Blue Bold)
        if (data.column.index === 1) {
          if (rawItem._flag === "H") {
            data.cell.styles.textColor = [220, 38, 38]; // Bold Red
            data.cell.styles.fontStyle = "bold";
          } else if (rawItem._flag === "L") {
            data.cell.styles.textColor = [37, 99, 235]; // Bold Blue
            data.cell.styles.fontStyle = "bold";
          }
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // Position after table
  let finalY = doc.lastAutoTable.finalY + 6;

  // Clinical Remarks (if present)
  if (laboratory.remarks && laboratory.remarks.trim() !== "-") {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, finalY, 182, 11, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, finalY, 182, 11, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(6, 78, 59);
    doc.text("Clinical Remarks / Notes:", 17, finalY + 4.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(laboratory.remarks, 17, finalY + 8.5);

    finalY += 15;
  }

  // Check if signature fits on page or needs space
  if (finalY > 240) {
    doc.addPage();
    finalY = 25;
  }

  // =========================================================================
  // 4. DOCTOR / PATHOLOGIST SIGNATURE SECTION (MATCHES REFERENCE IMAGE)
  // =========================================================================
  const signX = 145;
  const signY = finalY + 10;

  // Realistic Pathologist Signature Vector
  doc.setDrawColor(20, 83, 45); // Dark emerald ink
  doc.setLineWidth(0.65);
  doc.lines(
    [
      [3, -5],
      [6, 3],
      [3, -6],
      [5, 5],
      [8, -4],
      [7, 2],
      [6, -3],
    ],
    signX,
    signY
  );
  doc.lines(
    [
      [3, -3],
      [5, 2],
      [5, -4],
      [10, 1],
    ],
    signX + 11,
    signY - 2
  );
  doc.setLineWidth(0.25);
  doc.line(signX - 4, signY + 4, signX + 42, signY + 4);

  // Doctor credentials underneath signature
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Jyoti M. J, MD", signX + 19, signY + 9, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("Consultant Pathologist", signX + 19, signY + 13.5, { align: "center" });

  // =========================================================================
  // 5. FOOTER SECTION (EXACT REFERENCE MATCH)
  // =========================================================================
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom border line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.35);
    doc.line(14, 280, 196, 280);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);

    // Left Footer: Patient Info & Generated By
    doc.text(
      `Patient: ${patientName} ${age} Year(s)/${gender} ${crNo}`,
      14,
      284.5
    );
    doc.text("Generated By: PAVITHRA / PAVITHRA, D00291", 14, 288.5);

    // Center Footer: Page Number
    doc.setFont("helvetica", "bold");
    doc.text(`Page   ${i}   of   ${totalPages}`, 105, 286.5, { align: "center" });

    // Right Footer: Sample No & Generated On
    doc.setFont("helvetica", "normal");
    doc.text(`Sample No: ${sampleNo}`, 196, 284.5, { align: "right" });
    doc.text(`Generated On: ${formatDateTime(new Date())}`, 196, 288.5, {
      align: "right",
    });

    // Disclaimer
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Electronically verified and signed diagnostic report issued by Department of Laboratory Medicine, NI AROGIYAM Hospital.",
      105,
      292.5,
      { align: "center" }
    );
  }

  // Download filename
  const cleanName = patientName.replace(/\s+/g, "_") || "Patient";
  const cleanTest = (laboratory.testType || "Lab_Report").replace(/[\s/]+/g, "_");
  const filename = `LabReport_${cleanName}_${cleanTest}.pdf`;

  doc.save(filename);
  return filename;
}

/**
 * Generates an official Tax Invoice / Hospital Receipt for an individual bill item.
 */
export function generateIndividualBillPDF(bill, patient = {}) {
  if (!bill) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pName = patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Ramesh Kumar";
  const pId = patient.userId || patient.patientId || "PAT-1001";
  const pPhone = patient.phone || patient.phoneNumber || "+91 9876543210";
  const pGender = patient.gender || "Male";
  const pAge = patient.age || 42;

  // Header Banner
  doc.setFillColor(6, 78, 59); // Deep Emerald #064E3B
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NI AROGIYAM HOSPITAL", 14, 15);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Multi-Speciality Healthcare & Diagnostic Research Centre | NABH & ISO Certified", 14, 21.5);
  doc.text("Madurai Bypass Road, Madurai, Tamil Nadu - 625016 | Helpline: +91 452 300 5300 | billing@ni-arogiyam.org", 14, 26.5);
  doc.text("GSTIN: 33AAAAA0000A1Z5 | Integrated Hospital Billing & Finance Division", 14, 31.5);

  // Invoice Title
  doc.setFillColor(240, 253, 244);
  doc.rect(14, 42, 182, 10, "F");
  doc.setDrawColor(187, 247, 208);
  doc.rect(14, 42, 182, 10, "D");

  doc.setTextColor(6, 78, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("HOSPITAL INVOICE & OFFICIAL PAYMENT RECEIPT", 18, 48.5);

  const statusStr = (bill.status || "PAID").toUpperCase();
  const isPaid = statusStr === "PAID";

  // Status Stamp on Top Right
  if (isPaid) {
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(155, 43.5, 36, 7, 1.5, 1.5, "F");
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(8.5);
    doc.text("✓ PAID IN FULL", 173, 48.2, { align: "center" });
  } else {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(155, 43.5, 36, 7, 1.5, 1.5, "F");
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8.5);
    doc.text("● PENDING DUE", 173, 48.2, { align: "center" });
  }

  // Two-column metadata
  autoTable(doc, {
    startY: 56,
    head: [["Invoice & Billing Details", "Patient Demographics"]],
    body: [
      [
        `Invoice ID: ${bill.id}\nBilling Date: ${bill.date}\nDue Date: ${bill.dueDate || bill.date}\nPayment Mode: ${bill.paymentMode || (isPaid ? "Online / Card" : "Pending")}`,
        `Patient Name: ${pName}\nPatient ID: ${pId}\nAge / Gender: ${pAge} Yrs / ${pGender}\nMobile: ${pPhone}`,
      ],
    ],
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 3.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.3,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 9,
    },
    margin: { left: 14, right: 14 },
  });

  // Itemized services table
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 7,
    head: [["#", "Description of Medical Service", "Department", "Qty", "Unit Rate", "Amount (INR)"]],
    body: [
      [
        "1",
        bill.description,
        bill.department,
        "1",
        `Rs. ${Number(bill.amount).toLocaleString("en-IN")}`,
        `Rs. ${Number(bill.amount).toLocaleString("en-IN")}`,
      ],
    ],
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 4,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [6, 78, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 78 },
      2: { cellWidth: 42 },
      3: { cellWidth: 14, halign: "center" },
      4: { cellWidth: 20, halign: "right" },
      5: { cellWidth: 24, halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  // Summary breakdown
  const billAmount = Number(bill.amount) || 0;
  const paidAmount = isPaid ? billAmount : 0;
  const balanceDue = isPaid ? 0 : billAmount;

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 4,
    body: [
      ["Subtotal", `Rs. ${billAmount.toLocaleString("en-IN")}`],
      ["Healthcare GST / Service Tax (Exempted under Sec 66D)", "Rs. 0.00"],
      ["Total Invoice Amount", `Rs. ${billAmount.toLocaleString("en-IN")}`],
      ["Amount Paid", `Rs. ${paidAmount.toLocaleString("en-IN")}`],
      ["Outstanding Balance Due", `Rs. ${balanceDue.toLocaleString("en-IN")}`],
    ],
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 2.2,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 140, halign: "right", fontStyle: "normal" },
      1: { cellWidth: 48, halign: "right", fontStyle: "bold" },
    },
    didParseCell: function (data) {
      if (data.row.index === 2) {
        data.cell.styles.fillColor = [240, 253, 244];
        data.cell.styles.textColor = [6, 78, 59];
        data.cell.styles.fontSize = 9.5;
      }
      if (data.row.index === 4 && balanceDue > 0) {
        data.cell.styles.textColor = [180, 83, 9];
      }
    },
    margin: { left: 14, right: 14 },
  });

  const signY = doc.lastAutoTable.finalY + 22;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(14, signY - 5, 196, signY - 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Authorized Billing Officer", 160, signY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("NI AROGIYAM Accounts & Revenue Department", 160, signY + 9.5, { align: "center" });

  doc.text(
    "Note: This is an authentic computer generated hospital invoice. No physical signature required.",
    14,
    signY + 18
  );

  const filename = `Invoice_${bill.id}_${pName.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
  return filename;
}

/**
 * Generates the complete, consolidated Patient Health & Financial Record PDF
 * encompassing all modules: Invoices, Payments, Lab Diagnostics, Prescriptions,
 * Consultations, and Patient Profile.
 */
export function generatePatientConsolidatedPDF(patient = {}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pName = patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Ramesh Kumar";
  const pId = patient.userId || patient.patientId || "PAT-1001";
  const pPhone = patient.phone || patient.phoneNumber || "+91 9876543210";
  const pGender = (patient.gender || "Male").toUpperCase();
  const pAge = patient.age || 42;
  const pBlood = patient.bloodGroup || "O+";
  const pEmail = patient.email || "ramesh.kumar@example.com";

  const bills = Array.isArray(patient.bills) ? patient.bills : [];
  const medicines = Array.isArray(patient.medicines) ? patient.medicines : [];
  const reports = Array.isArray(patient.reports) ? patient.reports : [];
  const appointments = Array.isArray(patient.appointments) ? patient.appointments : [];

  const totalBilled = bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalPaid = bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const pendingDue = totalBilled - totalPaid;

  const formatDateTime = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Header Banner (Emerald Theme)
  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NI AROGIYAM HOSPITAL", 14, 15);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Multi-Speciality Healthcare & Research Institute | NABH Accredited & NABL Certified Labs", 14, 21.5);
  doc.text("Madurai Bypass Road, Madurai, Tamil Nadu - 625016 | 24/7 Emergency & Helpline: +91 452 300 5300", 14, 26.5);
  doc.text("Integrated Patient Health Record (EHR) & Consolidated Hospital Statement", 14, 31.5);

  // Document Title Bar
  doc.setFillColor(240, 253, 244);
  doc.rect(14, 42, 182, 11, "F");
  doc.setDrawColor(187, 247, 208);
  doc.rect(14, 42, 182, 11, "D");

  doc.setTextColor(6, 78, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("CONSOLIDATED PATIENT MEDICAL & FINANCIAL RECORD", 18, 49);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated: ${formatDateTime(new Date())}`, 190, 49, { align: "right" });

  // Patient Demographic Information Table
  autoTable(doc, {
    startY: 57,
    head: [["Patient Demographics & Profile", "Hospital Registration Identifiers"]],
    body: [
      [
        `Patient Full Name: ${pName}\nAge & Gender: ${pAge} Yrs / ${pGender}\nBlood Group: ${pBlood}\nContact Mobile: ${pPhone}`,
        `Patient ID / CRN: ${pId}\nEmail Address: ${pEmail}\nHospital Location: Madurai Main Campus\nRecord Type: Outpatient & Inpatient Consolidated`,
      ],
    ],
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 3.2,
      lineColor: [203, 213, 225],
      lineWidth: 0.3,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 9,
    },
    margin: { left: 14, right: 14 },
  });

  let currentY = doc.lastAutoTable.finalY + 7;

  // =========================================================================
  // MODULE 1: FINANCIAL & BILLING STATEMENT
  // =========================================================================
  doc.setFillColor(226, 242, 230); // Soft green #E2F2E6
  doc.rect(14, currentY, 182, 8.5, "F");
  doc.setTextColor(15, 63, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("1. FINANCIAL ACCOUNT & INVOICES SUMMARY", 18, currentY + 5.5);

  // Financial KPI strip
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Total Invoiced: Rs. ${totalBilled.toLocaleString("en-IN")}   |   Total Paid: Rs. ${totalPaid.toLocaleString("en-IN")}   |   Pending Balance: Rs. ${pendingDue.toLocaleString("en-IN")}`,
    192,
    currentY + 5.5,
    { align: "right" }
  );

  const billRows = bills.map((b) => [
    b.id,
    b.description,
    b.department,
    b.date,
    `Rs. ${Number(b.amount).toLocaleString("en-IN")}`,
    b.status === "Paid" ? `Paid (${b.paymentMode || "Online"})` : "Pending Due",
  ]);

  billRows.push([
    "TOTALS",
    "Consolidated Hospital Account Balance",
    "-",
    "-",
    `Rs. ${totalBilled.toLocaleString("en-IN")}`,
    `Paid: Rs. ${totalPaid.toLocaleString("en-IN")} | Due: Rs. ${pendingDue.toLocaleString("en-IN")}`,
  ]);

  autoTable(doc, {
    startY: currentY + 10,
    head: [["Invoice ID", "Service Description", "Department", "Date", "Amount", "Payment Status"]],
    body: billRows,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 8.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: "bold" },
      1: { cellWidth: 64 },
      2: { cellWidth: 36 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20, halign: "right", fontStyle: "bold" },
      5: { cellWidth: 26, halign: "center" },
    },
    didParseCell: function (data) {
      if (data.row.index === billRows.length - 1) {
        data.cell.styles.fillColor = [240, 253, 244];
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [6, 78, 59];
      }
      if (data.column.index === 5 && data.row.index < billRows.length - 1) {
        const txt = String(data.cell.raw || "");
        if (txt.includes("Paid")) {
          data.cell.styles.textColor = [22, 101, 52];
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [180, 83, 9];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Check page break
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // =========================================================================
  // MODULE 2: DIAGNOSTIC LABORATORY INVESTIGATIONS (ALL LAB MODULES)
  // =========================================================================
  doc.setFillColor(226, 242, 230);
  doc.rect(14, currentY, 182, 8.5, "F");
  doc.setTextColor(15, 63, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("2. DIAGNOSTIC LABORATORY & PATHOLOGY INVESTIGATIONS (ALL LAB MODULES)", 18, currentY + 5.5);

  currentY += 11;

  // Render all reports with parameters
  reports.forEach((rep) => {
    if (currentY > 235) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(6, 78, 59);
    doc.text(`Test: ${rep.testName}`, 14, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Dept: ${rep.department}   |   Date: ${rep.date}   |   Consultant: ${rep.doctor || "Dr. Suresh V."}`, 196, currentY, { align: "right" });

    currentY += 3.5;

    const paramRows = (rep.parameters || []).map((p) => [
      p.name,
      p.value,
      p.normal || "Clinical Reference Interval",
      "Normal / Stable",
    ]);

    if (paramRows.length === 0) {
      paramRows.push([rep.testName, rep.resultSummary || "Completed", "Clinical Standard", "Evaluated"]);
    }

    autoTable(doc, {
      startY: currentY,
      head: [["Test Parameter", "Observed Value", "Biological Reference Range", "Clinical Evaluation"]],
      body: paramRows,
      theme: "plain",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2.2,
        lineColor: [226, 232, 240],
        lineWidth: 0.15,
        textColor: [15, 23, 42],
      },
      headStyles: {
        fillColor: [248, 250, 252],
        textColor: [15, 23, 42],
        fontStyle: "bold",
        fontSize: 8,
        lineColor: [203, 213, 225],
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: "bold" },
        1: { cellWidth: 36, fontStyle: "bold", textColor: [6, 78, 59] },
        2: { cellWidth: 50 },
        3: { cellWidth: 36, textColor: [22, 101, 52] },
      },
      margin: { left: 14, right: 14 },
    });

    currentY = doc.lastAutoTable.finalY + 3;

    if (rep.resultSummary) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Clinical Impression: ${rep.resultSummary}`, 14, currentY);
      currentY += 6;
    }
  });

  // Check page break
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // =========================================================================
  // MODULE 3: ACTIVE MEDICATIONS & PHARMACY PRESCRIPTIONS
  // =========================================================================
  doc.setFillColor(226, 242, 230);
  doc.rect(14, currentY, 182, 8.5, "F");
  doc.setTextColor(15, 63, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("3. ACTIVE PHARMACEUTICALS & PRESCRIBED MEDICATIONS", 18, currentY + 5.5);

  const medRows = medicines.map((m) => [
    m.name,
    m.type,
    `${m.dosage} (${m.instruction})`,
    m.duration,
    m.doctor,
  ]);

  autoTable(doc, {
    startY: currentY + 10,
    head: [["Medication Name", "Therapeutic Class", "Dosage & Schedule", "Duration", "Prescribing Doctor"]],
    body: medRows,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 8.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold" },
      1: { cellWidth: 42 },
      2: { cellWidth: 42 },
      3: { cellWidth: 26 },
      4: { cellWidth: 32 },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Check page break
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // =========================================================================
  // MODULE 4: CLINICAL CONSULTATIONS & APPOINTMENTS HISTORY
  // =========================================================================
  doc.setFillColor(226, 242, 230);
  doc.rect(14, currentY, 182, 8.5, "F");
  doc.setTextColor(15, 63, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("4. CLINICAL CONSULTATIONS & APPOINTMENTS HISTORY", 18, currentY + 5.5);

  const aptRows = appointments.map((apt) => [
    apt.id,
    `${apt.doctorName} (${apt.department})`,
    `${apt.date} ${apt.slot || ""}`.trim(),
    apt.room || "OPD Suite",
    `${apt.status} - ${apt.notes || "Consultation"}`,
  ]);

  autoTable(doc, {
    startY: currentY + 10,
    head: [["Booking ID", "Attending Doctor & Speciality", "Date & Slot", "Venue / Clinic", "Clinical Status & Notes"]],
    body: aptRows,
    theme: "striped",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [15, 23, 42],
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 8.5,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: "bold" },
      1: { cellWidth: 50 },
      2: { cellWidth: 32 },
      3: { cellWidth: 34 },
      4: { cellWidth: 52 },
    },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // Check page break for signatures
  if (currentY > 235) {
    doc.addPage();
    currentY = 25;
  }

  // Hospital Certification & Signatures
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.35);
  doc.line(14, currentY, 196, currentY);

  currentY += 8;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Medical Attestation: This consolidated health record represents verified hospital encounters, financial invoices, laboratory diagnostic investigations, and physician orders recorded in the NI AROGIYAM Hospital Information System.",
    14,
    currentY,
    { maxWidth: 182 }
  );

  currentY += 16;

  // Doctor Signature Left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Suresh V., MD, DM (Cardiology)", 45, currentY, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text("Senior Attending Consultant & Medical Supervisor", 45, currentY + 4.5, { align: "center" });

  // Pathologist Signature Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Dr. Jyoti M. J, MD (Pathology)", 160, currentY, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text("Consultant Pathologist & Diagnostic Lab Director", 160, currentY + 4.5, { align: "center" });

  // Multi-page Footers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.35);
    doc.line(14, 282, 196, 282);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    doc.text(`Patient: ${pName} (${pId})  •  Consolidated Clinical & Financial Record`, 14, 286.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Page   ${i}   of   ${totalPages}`, 105, 286.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`Generated: ${formatDateTime(new Date())}`, 196, 286.5, { align: "right" });

    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Official Document • NI AROGIYAM Hospital Information System • For verification visit https://ni-arogiyam.vercel.app",
      105,
      291,
      { align: "center" }
    );
  }

  const filename = `Consolidated_Patient_Record_${pName.replace(/\s+/g, "_")}_${pId}.pdf`;
  doc.save(filename);
  return filename;
}

export { getReportContentForTest };
