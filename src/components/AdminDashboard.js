import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import "../styles/PatientList.css";
import "../styles/DoctorStyles.css";
import PatientList from "./PatientList";
import DoctorRegistration from "./DoctorRegistration";
import AdminRegistration from "./AdminRegistration";
import AdminList from "./AdminList";
import DoctorList from "./DoctorList";
import axios from "axios";

// const AdminDashboard = () => {
function AdminDashboard({ auth, setAuth, onLogout }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [patientCount, setPatientCount] = useState(0);
const [doctorCount, setDoctorCount] = useState(0);
const [adminCount, setAdminCount] = useState(0);
const [prescriptionCount, setPrescriptionCount] = useState(0);
const [showUserDropdown, setShowUserDropdown] = useState(false);
const [showProfileModal, setShowProfileModal] = useState(false);
const [adminName, setAdminName] = useState('N/A');

useEffect(() => {
  const fetchStats = async () => {
    try {
            const token = localStorage.getItem("authToken");

      const [patientsRes, doctorsRes, adminsRes, prescriptionsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/patients/patient-count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/admin/doctor-count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/admin/count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/prescription/count", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPatientCount(patientsRes.data);
      setDoctorCount(doctorsRes.data);
      setAdminCount(adminsRes.data);
      setPrescriptionCount(prescriptionsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchAdminName = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (userId) {
        const response = await axios.get(`http://localhost:8080/admin/get/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.name) {
          setAdminName(response.data.name);
        }
      }
    } catch (error) {
      console.error("Error fetching admin name:", error);
      // Keep the default 'N/A' value if there's an error
    }
  };

  fetchStats();
  fetchAdminName();
}, [auth]);

const hellot = () => {

   // Remove specific keys from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    localStorage.removeItem('userId');

    // Optional: Clear everything
    // localStorage.clear();

    // Navigate to login or home
    navigate('/login'); // or navigate('/')
  };

  const handleLogout = () => {
    console.log('AdminDashboard: handleLogout called');
    try {
      // Use the centralized logout function
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userSession');
      console.log('AdminDashboard: localStorage items removed');
      onLogout();
      console.log('AdminDashboard: onLogout completed');
   
      // Use setTimeout to ensure state updates are processed before navigation
      setTimeout(() => {
        navigate('/', { replace: true });
        console.log('AdminDashboard: Navigation to login completed');
      }, 100);

    } catch (error) {
      console.error('AdminDashboard: Error during logout:', error);
      // Even if there's an error, try to navigate away
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setShowUserDropdown(false); 
  };


  useEffect(() => {
    // Apply theme to body
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Theme Toggle Functionality
    const themeToggle = document.getElementById("themeToggle");

    

    function handleThemeToggle() {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    }

    // Update icon when theme changes
    if (themeToggle) {
      themeToggle.addEventListener("click", handleThemeToggle);
    }

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("sidebar");

        function handleMobileMenuClick() {
      sidebar.classList.toggle("open");
    }
        
    function handleDocumentClick(e) {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          sidebar.classList.remove("open");
        }
      }
       }

       function handleWindowResize() {
      if (window.innerWidth > 1024) {
        sidebar.classList.remove("open");
      }
        }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", handleMobileMenuClick);
    }

    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("resize", handleWindowResize);


    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");
    const navClickHandlers = [];





    navLinks.forEach((link) => {
            const handler = (e) => {
        e.preventDefault();
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        const sectionName = link
          .querySelector("span")
          .textContent.toLowerCase();
        showSection(sectionName);
           };
      link.addEventListener("click", handler);
      navClickHandlers.push({ link, handler });

    });

    function showSection(sectionName) {
      sections.forEach((section) => section.classList.remove("active"));
      let targetSection;
      switch (sectionName) {
        case "dashboard":
          targetSection = document.getElementById("dashboard-section");
          break;
        case "patient":
          targetSection = document.getElementById("patient-section");
          break;
        case "doctor":
          targetSection = document.getElementById("doctor-section");
          break;
        case "admin register":
        case "admin":
          targetSection = document.getElementById("admin-section");
          break;
        case "prescription":
          targetSection = document.getElementById("prescription-section");
          break;
        default:
          targetSection = document.getElementById("dashboard-section");
      }
      if (targetSection) {
        targetSection.classList.add("active");
      }
    }

    function initTabNavigation() {
      const tabButtons = document.querySelectorAll(".tab-btn");
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const tabName = button.getAttribute("data-tab");
          const parentSection = button.closest(".section");
          parentSection
            .querySelectorAll(".tab-btn")
            .forEach((btn) => btn.classList.remove("active"));
          parentSection
            .querySelectorAll(".tab-content")
            .forEach((content) => content.classList.remove("active"));
          button.classList.add("active");
          const targetContent = document.getElementById(tabName);
          if (targetContent) {
            targetContent.classList.add("active");
          }
        });
      });
    }

    // Patient data is now handled by the PatientList React component
    let doctors = [
      {
        id: "D001",
        name: "Dr. Emily Wilson",
        email: "emily.wilson@hospital.com",
        phone: "+1-555-0201",
        specialization: "cardiology",
        experience: 12,
        status: "active",
      },
      {
        id: "D002",
        name: "Dr. James Davis",
        email: "james.davis@hospital.com",
        phone: "+1-555-0202",
        specialization: "neurology",
        experience: 8,
        status: "active",
      },
      {
        id: "D003",
        name: "Dr. Lisa Anderson",
        email: "lisa.anderson@hospital.com",
        phone: "+1-555-0203",
        specialization: "pediatrics",
        experience: 15,
        status: "active",
      },
    ];

    // Function to check backend connectivity
    async function checkBackendConnectivity() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return false;

        await axios.get("http://localhost:8080/api/patients/patient-count", {
          headers: { "Authorization": `Bearer ${token}` },
          timeout: 5000
        });

        // Hide error message if connection is successful
        const statusElement = document.getElementById("backend-status");
        if (statusElement) {
          statusElement.style.display = 'none';
        }
        return true;
      } catch (error) {
        // Show error message if connection fails
        const statusElement = document.getElementById("backend-status");
        if (statusElement) {
          statusElement.style.display = 'block';
        }
        return false;
      }
    }


    function initFormHandling() {
      const patientForm = document.getElementById("patient-form");
      if (patientForm && !patientForm.hasAttribute("data-listener-attached")) {
          patientForm.setAttribute("data-listener-attached", "true");
          patientForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const formData = new FormData(patientForm);
// Basic client-side validation
const requiredFields = ['fullName', 'email', 'phone', 'address', 'dob', 'gender', 'password'];
const missingFields = [];

for (const field of requiredFields) {
  const value = formData.get(field);
  if (!value || value.trim() === '') {
    missingFields.push(field);
  }
}

if (missingFields.length > 0) {
  alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
  return;
}

// Validate email format
const email = formData.get('email');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  alert('Please enter a valid email address.');
  return;
}
// Validate date format
const dob = formData.get('dob');
if (!dob) {
  alert('Please select a date of birth.');
  return;
}

// Validate gender selection
const gender = formData.get('gender');
if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
  alert('Please select a valid gender.');
  return;
}

// Validate phone number format (basic validation)
const phone = formData.get('phone');
if (phone && phone.length < 10) {
  alert('Please enter a valid phone number with at least 10 digits.');
  return;
}

          // Prepare patient data in the exact format expected by backend
          const patientFormData = new FormData();
          patientFormData.append("name", formData.get("fullName"));
          patientFormData.append("email", formData.get("email"));
          patientFormData.append("phone", formData.get("phone"));
          patientFormData.append("address", formData.get("address"));
          patientFormData.append("dob", formData.get("dob"));

          // Handle gender field properly
          // const gender = formData.get("gender");
          if (gender) {
            patientFormData.append("gender", gender.toUpperCase());
          } else {
            console.error("Gender field is required");
            alert("Please select a gender before submitting the form.");
            return;
          }

          patientFormData.append("password", formData.get("password"));
          patientFormData.append("status", "ACTIVE");
          patientFormData.append("treatment", formData.get("treatmentType") || "Physiotherapy");
         
          
          // Handle image file - backend expects this field
          const imageFile = formData.get("image");
          if (imageFile && imageFile.size > 0) {
            patientFormData.append("image", imageFile);
          } else {
            // Create a minimal empty file to satisfy backend multipart requirements
            const emptyBlob = new Blob([''], { type: 'application/octet-stream' });
            const dummyFile = new File([emptyBlob], 'empty.dat', { type: 'application/octet-stream' });
            patientFormData.append("image", dummyFile);
          }

          try {
            const token = localStorage.getItem("authToken");
            // Check if user is authenticated
            if (!token) {
              alert("You must be logged in to register a patient.");
              return;
            }

            // Additional token validation
            console.log("Using auth token:", token.substring(0, 20) + "...");

            // Test backend connectivity first
            const isConnected = await checkBackendConnectivity();
            if (!isConnected) {
              alert("Cannot connect to backend server. Please ensure the Spring Boot backend is running on port 8080.");
              return;
            }

            console.log("Submitting patient data:", Object.fromEntries(patientFormData));
            console.log("Form data entries:");
            for (let [key, value] of patientFormData.entries()) {
              console.log(`${key}:`, value);
            }


            const response = await axios.post(
              "http://localhost:8080/api/patients/add",
              patientFormData,
              {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "multipart/form-data"
                }
              }
            );

            console.log("Patient registration response:", response.data);
          
            // Reset form
            patientForm.reset();

            // Show success message
            alert("Patient registered successfully!");
         


            // Patient table refresh is now handled by the PatientList React component
          } catch (error) {
            console.error("Error registering patient:", error);
            console.error("Error details:", {
              response: error.response?.data,
              status: error.response?.status,
              message: error.message
            });


            // Provide more specific error messages
            if (error.response) {
              // Server responded with error status
              const status = error.response.status;
              const message = error.response.data?.message || error.response.data || error.response.statusText;

            
              if (status === 401) {
                console.log('AdminDashboard: 401 error during patient registration - checking if token is actually invalid');
                // Only logout if the error specifically indicates invalid token
                const errorMessage = message.toLowerCase();
                if (errorMessage.includes('token') || errorMessage.includes('unauthorized') || errorMessage.includes('expired')) {
                  alert("Your session has expired. Please log in again.");
                  handleLogout();
                } else {
                  alert("Authentication failed. Please check your credentials and try again.");
                }
              } else if (status === 400) {
                alert(`Invalid data: ${message}`);
              } else if (status === 409) {
                alert("A patient with this email or phone already exists.");
              } else if (status === 500) {
                alert(`Server error: ${message}. Please check the server logs for more details.`);
              } else {
                alert(`Server error (${status}): ${message}`);
              }
            } else if (error.request) {
              // Network error - likely backend not running
              console.error("Network error - backend may not be running:", error.request);
              alert("Cannot connect to server. Please ensure the backend server is running on http://localhost:8080 and try again.");

            } else {
              // Other error
              alert("An unexpected error occurred. Please try again.");
            }

          }
        });
      }

      // Doctor Form
      const doctorForm = document.getElementById("doctor-form");
      if (doctorForm && !doctorForm.hasAttribute("data-listener-attached")) {
        doctorForm.setAttribute("data-listener-attached", "true");

        doctorForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = new FormData(doctorForm);
          const doctorData = Object.fromEntries(formData);

          // Generate ID
          doctorData.id = "D" + String(doctors.length + 1).padStart(3, "0");
          doctorData.name = doctorData.fullName;
          doctorData.status = "active";

          // Add to doctors array
          doctors.push(doctorData);

          // Reset form
          doctorForm.reset();

          // Show success message
          alert("Doctor registered successfully!");

          // Refresh doctor table if visible
          if (
            document.getElementById("doctor-list").classList.contains("active")
          ) {
            renderDoctorTable();
          }
        });
      }
    }
    
    function renderDoctorTable(filteredDoctors = doctors) {
      const tbody = document.getElementById("doctor-table-body");
      if (!tbody) return;

      tbody.innerHTML = "";

      if (filteredDoctors.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="empty-state">
                            <i class="fas fa-user-md"></i>
                            <p>No doctors found</p>
                        </td>
                    </tr>
                `;
        return;
      }

      filteredDoctors.forEach((doctor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${doctor.id}</td>
                    <td>${doctor.name}</td>
                    <td>${doctor.email}</td>
                    <td>${doctor.phone}</td>
                    <td>${
                      doctor.specialization
                        ? doctor.specialization.charAt(0).toUpperCase() +
                          doctor.specialization.slice(1)
                        : "N/A"
                    }</td>
                    <td>${doctor.experience || 0} years</td>
                    <td><span class="status-badge status-${doctor.status}">${
          doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)
        }</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-small btn-edit" onclick="editDoctor('${
                              doctor.id
                            }')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-small btn-delete" onclick="deleteDoctor('${
                              doctor.id
                            }')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
        tbody.appendChild(row);
      });
    }
    function initFiltering() {
     

      // Doctor filtering
      const doctorFilter = document.getElementById("doctor-filter");
      const doctorSearch = document.getElementById("doctor-search");

      if (doctorFilter) {
        doctorFilter.addEventListener("change", filterDoctors);
      }

      if (doctorSearch) {
        doctorSearch.addEventListener("input", filterDoctors);
      }
    }
    
    function filterDoctors() {
      const filterValue = document.getElementById("doctor-filter").value;
      const searchValue = document
        .getElementById("doctor-search")
        .value.toLowerCase();

      let filtered = doctors;

      // Apply filter
      if (filterValue !== "all") {
        filtered = filtered.filter(
          (doctor) => doctor.specialization === filterValue
        );
      }

      // Apply search
      if (searchValue) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchValue) ||
            doctor.email.toLowerCase().includes(searchValue) ||
            doctor.specialization.toLowerCase().includes(searchValue)
        );
      }

      renderDoctorTable(filtered);
    }

   

    // function editDoctor(id) {
    //   const doctor = doctors.find((d) => d.id === id);
    //   if (doctor) {
    //     alert(
    //       `Edit doctor: ${doctor.name}\n(This would open an edit form in a real application)`
    //     );
    //   }
    // }

    window.editDoctor = function editDoctor(id) {
      const doctor = doctors.find((d) => d.id === id);
      if (doctor) {
        alert(
          `Edit doctor: ${doctor.name}\n(This would open an edit form in a real application)`
        );
      }
    };


    // function deleteDoctor(id) {
    //   if (window.confirm("Are you sure you want to delete this doctor?")) {
    //     doctors = doctors.filter((d) => d.id !== id);
    //     renderDoctorTable();
    //     alert("Doctor deleted successfully!");
    //   }
    // }

    window.deleteDoctor = function deleteDoctor(id) {
      if (window.confirm("Are you sure you want to delete this doctor?")) {
        doctors = doctors.filter((d) => d.id !== id);
        renderDoctorTable();
        alert("Doctor deleted successfully!");
      }
    };


    // Initialize everything when DOM is loaded
    let isInitialized = false;
    const initializeComponents = () => {
      // Prevent multiple initializations
      if (isInitialized) return;
      isInitialized = true;

      initTabNavigation();
      initFormHandling();
      initFiltering();

      // Initial render of tables

      renderDoctorTable();
    };
  
    // Use timeout to ensure DOM is fully rendered
    setTimeout(initializeComponents, 100);

    // Also add event listener as fallback
    document.addEventListener("DOMContentLoaded", initializeComponents);



    // document.addEventListener("DOMContentLoaded", () => {
    //   initTabNavigation();
    //   initFormHandling();
    //   initFiltering();
    //   renderDoctorTable();
    // });

    const searchInput = document.querySelector(".search-input");
    function handleSearchFocus() {
      if (searchInput && searchInput.parentElement) {
        searchInput.parentElement.style.transform = "scale(1.02)";
      }
    }
    
    function handleSearchBlur() {
      if (searchInput && searchInput.parentElement) {
        searchInput.parentElement.style.transform = "scale(1)";
      }
    }

       function handleKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener("focus", handleSearchFocus);
      searchInput.addEventListener("blur", handleSearchBlur);
    }
      
    document.addEventListener("keydown", handleKeydown);

    const notificationBtn = document.querySelector(".notification-btn");
    function handleNotificationClick() {
      if (notificationBtn) {
        const badge = notificationBtn.querySelector(".notification-badge");
        if (badge) {
          badge.style.animation = "none";
          setTimeout(() => {
            badge.style.animation = "pulse 0.5s ease-in-out";
          }, 10);
        }
      }
    }
    
    if (notificationBtn) {
      notificationBtn.addEventListener("click", handleNotificationClick);
    }

    const userProfile = document.querySelector(".user-profile");
    function handleUserProfileClick() {
      setShowUserDropdown(prev => !prev);

    }

    function handleDocumentClickForDropdown(e) {
      // Don't close dropdown if clicking on dropdown items
      if (e.target.closest('.dropdown-item')) {
        return;
      }
      if (userProfile && !userProfile.contains(e.target)) {
        setShowUserDropdown(false);
      }
    }
      
    if (userProfile) {
      userProfile.addEventListener("click", handleUserProfileClick);
    }

    document.addEventListener("click", handleDocumentClickForDropdown);


    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }

      .user-profile {
  position: relative;
  cursor: pointer;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
  margin-top: 8px;
  animation: fadeInDown 0.2s ease;
}

.dropdown-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.25s;
  color: var(--text-primary);
}

.dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-item i {
  width: 16px;
  color: var(--text-secondary);
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.signout-item {
  color: #ef4444;
}

.signout-item:hover {
  background: rgba(239, 68, 68, 0.1);
}

.signout-item i {
  color: #ef4444;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


    `;
    document.head.appendChild(style);

    document.documentElement.style.scrollBehavior = "smooth";

    // function addLoadingState(element, duration = 1000) {
    //   element.style.opacity = "0.7";
    //   element.style.pointerEvents = "none";
    //   setTimeout(() => {
    //     element.style.opacity = "1";
    //     element.style.pointerEvents = "auto";
    //   }, duration);
    // }

    // Set initial styles for animation
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.3s ease";

    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card) => {

      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease";

      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px) scale(1.02)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    });

    // window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.style.opacity = "1";
      const cards = document.querySelectorAll(".stat-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);
      });
    }, 100);


  //   document.body.style.opacity = "0";
  //   document.body.style.transition = "opacity 0.3s ease";
  //   statCards.forEach((card) => {
  //     card.style.opacity = "0";
  //     card.style.transform = "translateY(20px)";
  //     card.style.transition = "all 0.6s ease";
  //   });
  // }, []);




    return () => {
      if (themeToggle) {
        themeToggle.removeEventListener("click", handleThemeToggle);
      }

      // Remove mobile menu listener
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener("click", handleMobileMenuClick);
      }

      // Remove document and window listeners
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("resize", handleWindowResize);

      // Remove navigation listeners
      navClickHandlers.forEach(({ link, handler }) => {
        link.removeEventListener("click", handler);
      });

      // Remove search input listeners
      if (searchInput) {
        searchInput.removeEventListener("focus", handleSearchFocus);
        searchInput.removeEventListener("blur", handleSearchBlur);
      }

      // Remove keydown listener
      document.removeEventListener("keydown", handleKeydown);

      // Remove notification listener
      if (notificationBtn) {
        notificationBtn.removeEventListener("click", handleNotificationClick);
      }

      // Remove user profile listeners
      if (userProfile) {
        userProfile.removeEventListener("click", handleUserProfileClick);
      }

      document.removeEventListener("click", handleDocumentClickForDropdown);



      // Reset body styles
      document.body.style.opacity = "";
      document.body.style.transition = "";
    };
   }, [theme]); // Add theme as dependency



  return (
    <div className="dashboard-container">
      {/* sidebar */}
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <span>MedicNotes</span>
          </div>
        </div>

        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="/" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-user-injured"></i>
                <span>Patient</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-user-md"></i>
                <span>Doctor</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-prescription-bottle-alt"></i>
                <span>Prescription</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-user-shield"></i>
                <span>Admin Register</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* header */}

      <header className="header">
        <div className="header-left">
          <button className="mobile-menu-btn" id="mobileMenuBtn">
            <i className="fas fa-bars"></i>
          </button>

          <div className="search-container">
            <i className="search-icon fas fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search or type command..."
            />
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            id="themeToggle"
            title="Toggle theme"
            style={{marginTop:'-50px'}}
          >
            <i className="fas fa-sun" id="themeIcon"></i>
          </button>

          <button className="notification-btn" title="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>

          <div className="user-profile">
            <div className="user-avatar">
              {auth?.user?.image ? (
                <img 
                  src={auth.user.image} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{adminName}</div>
              <div className="user-role">{auth?.role || 'Admin'}</div>
            </div>
            <i
              className="fas fa-chevron-down"
              style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
            ></i>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-item" onClick={handleProfileClick}>
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </div>
                <div className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  <span>Settings</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item signout-item" onKeyPress={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Logout button clicked');
                  setShowUserDropdown(false);
                  handleLogout();
                }}>

                  <i className="fas fa-sign-out-alt"></i>
                  <span>Sign Out</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* main */}

      <main className="main-content">
        {/* Dashboard Section */}
        <div id="dashboard-section" className="section active">
          <div className="page-header fade-in-up">
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="breadcrumb-separator fas fa-chevron-right"></i>
              <span className="breadcrumb-item active">Overview</span>
            </nav>

            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening in your medical facility
              today.
            </p>
            <div id="backend-status" className="backend-status" style={{
              padding: '10px 15px',
              borderRadius: '6px',
              fontSize: '14px',
              marginTop: '15px',
              display: 'none',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                <strong>Backend Server Not Connected</strong>
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                The Spring Boot backend server is not running. Please:
                <br />
                1. Navigate to your backend project directory
                <br />
                2. Run: <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px' }}>mvn spring-boot:run</code> or <code style={{ backgroundColor: '#f3f4f6', padding: '2px 4px', borderRadius: '3px' }}>./gradlew bootRun</code>
                <br />
                3. Ensure the server starts on port 8080
              </div>
            </div>

          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div
              className="stat-card slide-in-left"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="stat-header">
                <div>
                  <div className="stat-title">Total Patients</div>
                  <div className="stat-value">{patientCount}</div>
                </div>
                <div className="stat-icon patients">
                  <i className="fas fa-user-injured"></i>
                </div>
              </div>
              {/* <div className="stat-change positive">
                <i className="change-icon fas fa-arrow-up"></i>
                <span>+5.2%</span>
                <span className="change-text">from last month</span>
              </div> */}
            </div>

            <div
              className="stat-card slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="stat-header">
                <div>
                  <div className="stat-title">Total Doctors</div>
                  <div className="stat-value">{doctorCount}</div>
                </div>
                <div className="stat-icon doctors">
                  <i className="fas fa-user-md"></i>
                </div>
              </div>
              {/* <div className="stat-change positive">
                <i className="change-icon fas fa-arrow-up"></i>
                <span>+2.1%</span>
                <span className="change-text">from last week</span>
              </div> */}
            </div>

            <div
              className="stat-card slide-in-left"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="stat-header">
                <div>
                  <div className="stat-title">Total Admins</div>
                  <div className="stat-value">{adminCount}</div>
                </div>
                <div className="stat-icon admins">
                  <i className="fas fa-user-shield"></i>
                </div>
              </div>
              {/* <div className="stat-change positive">
                <i className="change-icon fas fa-arrow-up"></i>
                <span>+1</span>
                <span className="change-text">new this month</span>
              </div> */}
            </div>

            <div
              className="stat-card slide-in-left"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="stat-header">
                <div>
                  <div className="stat-title">Total Prescriptions</div>
                  <div className="stat-value">{prescriptionCount}</div>
                </div>
                <div className="stat-icon prescriptions">
                  <i className="fas fa-prescription-bottle-alt"></i>
                </div>
              </div>
              {/* <div className="stat-change positive">
                <i className="change-icon fas fa-arrow-up"></i>
                <span>+8.7%</span>
                <span className="change-text">from last month</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Patient Section */}
        <div id="patient-section" className="section">
          <div className="page-header">
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="breadcrumb-separator fas fa-chevron-right"></i>
              <span className="breadcrumb-item active">Patient Management</span>
            </nav>
            <h1 className="page-title">Patient Management</h1>
            <p className="page-subtitle">
              Manage patient registrations and view patient information.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button className="tab-btn active" data-tab="patient-register">
              <i className="fas fa-user-plus"></i> Register Patient
            </button>
            <button className="tab-btn" data-tab="patient-list">
              <i className="fas fa-list"></i> Patient List
            </button>
          </div>

          {/* Patient Registration Tab */}
          <div id="patient-register" className="tab-content active">
            <div className="form-container">
              <h2 className="form-title">
                <i className="fas fa-user-plus"></i>
                Register New Patient
              </h2>
              <form id="patient-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      name="fullName"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      name="email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      name="phone"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      className="form-input"
                      name="dob"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select className="form-select" name="gender" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      name="password"
                      required
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" name="bloodGroup">
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input
                      type="tel"
                      className="form-input"
                      name="emergencyContact"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Treatment Type</label>
                    <select className="form-select" name="treatmentType">
                      <option value="">Select Treatment Type</option>
                      <option value="Physiotherapy">Physiotherapy</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Profile Image</label>
                    <input
                      type="file"
                      className="form-input"
                      name="image"
                      accept="image/*"
                    />
                  </div>

                </div>
                <div className="form-group">
                  <label className="form-label">Address *</label>

                  <textarea
                    className="form-textarea"
                    name="address"
                    placeholder="Enter full address"
                    required

                  ></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Medical History</label>
                  <textarea
                    className="form-textarea"
                    name="medicalHistory"
                    placeholder="Enter relevant medical history"
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary">
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Register Patient
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Patient List Tab */}
          <div id="patient-list" className="tab-content">
            <PatientList />
            
          </div>
        </div>

        {/* Doctor Section */}
        <div id="doctor-section" className="section">
          <div className="page-header">
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="breadcrumb-separator fas fa-chevron-right"></i>
              <span className="breadcrumb-item active">Doctor Management</span>
            </nav>
            <h1 className="page-title">Doctor Management</h1>
            <p className="page-subtitle">
              Manage doctor registrations and view doctor information.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button className="tab-btn active" data-tab="doctor-register">
              <i className="fas fa-user-md"></i> Register Doctor
            </button>
            <button className="tab-btn" data-tab="doctor-list">
              <i className="fas fa-list"></i> Doctor List
            </button>
          </div>

          {/* Doctor Registration Tab */}
          <div id="doctor-register" className="tab-content active">
            <DoctorRegistration />
            
          </div>

          {/* Doctor List Tab */}
          <div id="doctor-list" className="tab-content">
            <DoctorList />
          </div>
        </div>
        {/* Admin Section */}
        <div id="admin-section" className="section">
          <div className="page-header">
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="breadcrumb-separator fas fa-chevron-right"></i>
              <span className="breadcrumb-item active">Admin Management</span>
            </nav>
            <h1 className="page-title">Admin Management</h1>
            <p className="page-subtitle">
              Manage admin registrations and view admin information.
            </p>
          </div>
                
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button className="tab-btn active" data-tab="admin-register">
              <i className="fas fa-user-shield"></i> Register Admin
            </button>
            <button className="tab-btn" data-tab="admin-list">
              <i className="fas fa-list"></i> Admin List
            </button>
          </div>

          {/* Admin Registration Tab */}
          <div id="admin-register" className="tab-content active">
            <AdminRegistration />
          </div>
          <div id="admin-list" className="tab-content">
            <AdminList />
          </div>
        </div>

        {/* Prescription Section */}
        <div id="prescription-section" className="section">
          <div className="page-header">
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <i className="breadcrumb-separator fas fa-chevron-right"></i>
              <span className="breadcrumb-item active">Prescription Management</span>
            </nav>
            <h1 className="page-title">Prescription Management</h1>
            <p className="page-subtitle">
              Manage prescriptions and medical records.
            </p>
          </div>
          <div className="content-card">
            <p>Prescription management functionality will be implemented here.</p>
          </div>
        </div>
          
 
      </main>



      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Profile</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowProfileModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="profile-image-section">
                <div className="profile-image-container">
                  {auth?.user?.image ? (
                    <img 
                      src={auth.user.image} 
                      alt="Profile" 
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                  )}
                </div>
                <h3>{auth?.user?.name || auth?.username || 'User'}</h3>
                <p className="user-role-badge">{auth?.role || 'Admin'}</p>
              </div>
              
              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-id-card"></i> ID:
                  </span>
                  <span className="detail-value">{auth?.user?.id || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-user"></i> Full Name:
                  </span>
                  <span className="detail-value">{auth?.user?.name || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-envelope"></i> Email:
                  </span>
                  <span className="detail-value">{auth?.user?.email || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-phone"></i> Phone:
                  </span>
                  <span className="detail-value">{auth?.user?.phone || 'N/A'}</span>
                </div>
                
                {auth?.user?.address && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-map-marker-alt"></i> Address:
                    </span>
                    <span className="detail-value">{auth.user.address}</span>
                  </div>
                )}
                
               {auth?.user?.dob && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-calendar"></i> Date of Birth:
                    </span>
                    <span className="detail-value">{new Date(auth.user.dob).toLocaleDateString()}</span>
                  </div>
                )}
                
                {auth?.user?.gender && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-venus-mars"></i> Gender:
                    </span>
                    <span className="detail-value">{auth.user.gender}</span>
                  </div>
                )}
                
                {auth?.user?.department && (
                  <div className="detail-row">
                    <span className="detail-label">
                      <i className="fas fa-building"></i> Department:
                    </span>
                    <span className="detail-value">{auth.user.department}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-shield-alt"></i> Role:
                  </span>
                  <span className="detail-value">{auth?.role || 'Admin'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">
                    <i className="fas fa-info-circle"></i> Status:
                  </span>
                  <span className="detail-value status-active">{auth?.user?.status || 'ACTIVE'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;

