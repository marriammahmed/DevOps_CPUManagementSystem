package com.example.cpu_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cpus")
@CrossOrigin(origins = "http://localhost:3000")
public class CpuController {
    
    @Autowired
    private CpuRepository cpuRepository;
    
    @Autowired
    private SocketRepository socketRepository;

    // GET all CPUs
    @GetMapping
    public List<Cpu> getAllCpus() {
        return cpuRepository.findAll();
    }

    // GET one CPU by ID
    @GetMapping("/{id}")
    public Cpu getCpuById(@PathVariable Long id) {
        return cpuRepository.findById(id).orElse(null);
    }
 
    // CREATE a new CPU
    @PostMapping
    public Cpu createCpu(@RequestBody Cpu cpu) {
        return cpuRepository.save(cpu);
    }

    // UPDATE a CPU
    @PutMapping("/{id}")
    public Cpu updateCpu(@PathVariable Long id, @RequestBody Cpu cpuDetails) {
        Cpu cpu = cpuRepository.findById(id).orElse(null);
        if (cpu != null) {
            cpu.setBrand(cpuDetails.getBrand());
            cpu.setModel(cpuDetails.getModel());
            cpu.setSocket(cpuDetails.getSocket());
            return cpuRepository.save(cpu);
        }
        return null;
    }

    // DELETE a CPU
    @DeleteMapping("/{id}")
    public void deleteCpu(@PathVariable Long id) {
        cpuRepository.deleteById(id);
    }
}