package com.example.MedicNotes_Team_1.service;

import com.example.MedicNotes_Team_1.entity.Doctor;
import com.example.MedicNotes_Team_1.repository.DoctorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public ResponseEntity<String> registerDoctor(String doctorJson, MultipartFile image) throws IOException {
        try {
            Doctor doctor = objectMapper.readValue(doctorJson, Doctor.class);

            // Check if doctor with email already exists
            if (doctorRepository.findByEmail(doctor.getEmail()) != null) {
                return ResponseEntity.badRequest().body("A doctor with this email already exists. Please use a different email.");
            }

            // Check if doctor with phone already exists
            if (doctorRepository.findByPhone(doctor.getPhone()) != null) {
                return ResponseEntity.badRequest().body("A doctor with this phone number already exists. Please use a different phone number.");
            }

            // Validate gender
            if (doctor.getGender() == null) {
                return ResponseEntity.badRequest().body("Gender is required.");
            }

            // Validate status
            if (doctor.getStatus() == null) {
                doctor.setStatus(Doctor.Status.ACTIVE); // Default status
            }

            // Validate required fields
            if (doctor.getName() == null || doctor.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Doctor name is required.");
            }
            if (doctor.getEmail() == null || doctor.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Doctor email is required.");
            }
            if (doctor.getPhone() == null || doctor.getPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Doctor phone is required.");
            }
            if (doctor.getPassword() == null || doctor.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Doctor password is required.");
            }
            if (doctor.getSpecialization() == null || doctor.getSpecialization().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Doctor specialization is required.");
            }

            // Encrypt the password before saving
            doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                doctor.setDoctor_image(image.getBytes());
            }

            // Set timestamps
            doctor.setCreated_at(new Date());
            doctor.setUpdated_at(new Date());

            doctorRepository.save(doctor);
            return ResponseEntity.ok("Doctor registered successfully.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering doctor: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getAllDoctorsByAdmin(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
            Page<Doctor> doctorPage = doctorRepository.findAll(pageable);

            if (doctorPage.isEmpty()) {
                return ResponseEntity.status(404).body("No doctors found in the system.");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("doctors", doctorPage.getContent());
            response.put("currentPage", doctorPage.getNumber());
            response.put("totalItems", doctorPage.getTotalElements());
            response.put("totalPages", doctorPage.getTotalPages());
            response.put("pageSize", doctorPage.getSize());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctors: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorById(Long id) {
        try {
            Doctor doctor = doctorRepository.findById(id).orElse(null);
            if (doctor == null) {
                return ResponseEntity.status(404).body("Doctor with ID " + id + " not found.");
            }
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctor: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorsByName(String name) {
        try {
            List<Doctor> doctors = doctorRepository.findByName(name);
            if (doctors.isEmpty()) {
                return ResponseEntity.status(404).body("No doctors found with name: " + name);
            }
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctors by name: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorByEmail(String email) {
        try {
            Doctor doctor = doctorRepository.findByEmail(email);
            if (doctor == null) {
                return ResponseEntity.status(404).body("Doctor with email " + email + " not found.");
            }
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctor by email: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorByPhone(String phone) {
        try {
            Doctor doctor = doctorRepository.findByPhone(phone);
            if (doctor == null) {
                return ResponseEntity.status(404).body("Doctor with phone " + phone + " not found.");
            }
            return ResponseEntity.ok(doctor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctor by phone: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorsByGender(Doctor.Gender gender) {
        try {
            List<Doctor> doctors = doctorRepository.findByGender(gender);
            if (doctors.isEmpty()) {
                return ResponseEntity.status(404).body("No doctors found with gender: " + gender);
            }
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctors by gender: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorsBySpecialization(String specialization) {
        try {
            List<Doctor> doctors = doctorRepository.findBySpecialization(specialization);
            if (doctors.isEmpty()) {
                return ResponseEntity.status(404).body("No doctors found with specialization: " + specialization);
            }
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctors by specialization: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> getDoctorsByStatus(Doctor.Status status) {
        try {
            List<Doctor> doctors = doctorRepository.findByStatus(status);
            if (doctors.isEmpty()) {
                return ResponseEntity.status(404).body("No doctors found with status: " + status);
            }
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving doctors by status: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<String> updateDoctorStatus(Long id, String status) {
        try {
            Doctor existingDoctor = doctorRepository.findById(id).orElse(null);
            if (existingDoctor == null) {
                return ResponseEntity.badRequest().body("Doctor with ID " + id + " not found.");
            }

            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Status cannot be empty.");
            }

            // Validate status
            try {
                Doctor.Status newStatus = Doctor.Status.valueOf(status.toUpperCase());
                
                if (existingDoctor.getStatus() == newStatus) {
                    return ResponseEntity.ok("Doctor status is already " + newStatus + ".");
                }

                existingDoctor.setStatus(newStatus);
                existingDoctor.setUpdated_at(new Date());
                doctorRepository.save(existingDoctor);
                
                return ResponseEntity.ok("Doctor status updated successfully to " + newStatus + ".");
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid status provided. Allowed values: ACTIVE, INACTIVE.");
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating doctor status: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<String> updateDoctor(Long id, Doctor updatedDoctor) {
        try {
            Doctor existingDoctor = doctorRepository.findById(id).orElse(null);
            if (existingDoctor == null) {
                return ResponseEntity.badRequest().body("Doctor with ID " + id + " not found.");
            }

            // Check if email is being changed and if it already exists
            if (!existingDoctor.getEmail().equals(updatedDoctor.getEmail())) {
                Doctor doctorWithEmail = doctorRepository.findByEmail(updatedDoctor.getEmail());
                if (doctorWithEmail != null && !doctorWithEmail.getId().equals(id)) {
                    return ResponseEntity.badRequest().body("A doctor with this email already exists.");
                }
            }

            // Check if phone is being changed and if it already exists
            if (!existingDoctor.getPhone().equals(updatedDoctor.getPhone())) {
                Doctor doctorWithPhone = doctorRepository.findByPhone(updatedDoctor.getPhone());
                if (doctorWithPhone != null && !doctorWithPhone.getId().equals(id)) {
                    return ResponseEntity.badRequest().body("A doctor with this phone number already exists.");
                }
            }

            // Update fields
            existingDoctor.setName(updatedDoctor.getName());
            existingDoctor.setEmail(updatedDoctor.getEmail());
            existingDoctor.setPhone(updatedDoctor.getPhone());
            existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
            existingDoctor.setGender(updatedDoctor.getGender());
            existingDoctor.setDob(updatedDoctor.getDob());
            existingDoctor.setStatus(updatedDoctor.getStatus());

            // Update image if provided
            if (updatedDoctor.getDoctor_image() != null) {
                existingDoctor.setDoctor_image(updatedDoctor.getDoctor_image());
            }

            // Update password only if provided and not empty
            if (updatedDoctor.getPassword() != null && !updatedDoctor.getPassword().trim().isEmpty()) {
                existingDoctor.setPassword(passwordEncoder.encode(updatedDoctor.getPassword()));
            }

            existingDoctor.setUpdated_at(new Date());
            doctorRepository.save(existingDoctor);

            return ResponseEntity.ok("Doctor updated successfully.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating doctor: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> deleteDoctorById(Long id) {
        try {
            Doctor existingDoctor = doctorRepository.findById(id).orElse(null);
            if (existingDoctor == null) {
                return ResponseEntity.status(404).body("Doctor with ID " + id + " not found.");
            }

            doctorRepository.deleteById(id);
            return ResponseEntity.ok("Doctor deleted successfully.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting doctor: " + e.getMessage());
        }
    }

    @Override
    public long getDoctorCount() {
        return doctorRepository.count();
    }
}