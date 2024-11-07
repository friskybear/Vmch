import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  MedicalServices,
  AccessTime,
  Payment,
  Star,
} from "@mui/icons-material";

import Pagination from '@mui/material/Pagination';
import { baby, Psychologist } from "@/icons/icons";



const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const features = [
    {
      icon: baby() ,
      title: "Expert Doctors",
      description: "Connect with specialized doctors across various categories",
    },
    {
      icon: Psychologist(),
      title: "24/7 Availability",
      description: "Get medical consultation anytime, anywhere",
    },
    {
      icon: <Payment sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Secure Payments",
      description: "Multiple payment options including wallet and direct payment",
    },
    {
      icon: <Star sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Rated Services",
      description: "View and provide feedback for medical consultations",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Online Medical Consultation
              </Typography>
              <Typography variant="h5" paragraph>
                Connect with qualified doctors instantly for professional medical advice
              </Typography>
              <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="Search doctors or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: 400
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {feature.icon}
                <Typography variant="h6" sx={{ my: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "grey.100", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} textAlign="center">
              <Typography variant="h4" component="h3" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="body1" paragraph>
                Book your consultation with top medical professionals today
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Find a Doctor
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default Home;
