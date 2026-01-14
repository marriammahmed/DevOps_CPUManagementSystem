package com.example.cpu_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sockets")
@CrossOrigin(origins = "http://localhost:3000")
public class SocketController {
    
    @Autowired
    private SocketRepository socketRepository;

    // GET all sockets
    @GetMapping
    public List<Socket> getAllSockets() {
        return socketRepository.findAll();
    }

    // GET one socket by ID
    @GetMapping("/{id}")
    public Socket getSocketById(@PathVariable Long id) {
        return socketRepository.findById(id).orElse(null);
    }

    // CREATE a new socket
    @PostMapping
    public Socket createSocket(@RequestBody Socket socket) {
        return socketRepository.save(socket);
    }
}