package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DemoApplicationTests {

    @Autowired
    private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

    @Test
    void testEndpoints() throws Exception {
        mockMvc.perform(get("/api/appointments")).andExpect(status().isOk());
        mockMvc.perform(get("/api/appointments").header("Origin", "https://ni-arogiyam.vercel.app")).andExpect(status().isOk());
        mockMvc.perform(get("/api/contact-messages")).andExpect(status().isOk());
        mockMvc.perform(get("/api/contact-messages").header("Origin", "https://ni-arogiyam.vercel.app")).andExpect(status().isOk());
    }
}
