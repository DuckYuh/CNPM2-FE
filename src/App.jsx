import { Button, Card, CardContent, Typography } from "@mui/material";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="shadow-xl w-96">
        <CardContent className="text-center">
          <Typography variant="h5" color="primary" gutterBottom>
            Kết hợp MUI + Tailwind
          </Typography>
          <p className="text-gray-600 mb-4">
            Tailwind cho layout, MUI cho component ✨
          </p>
          <Button variant="contained" color="primary">
            Nút chính
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;