import React, { useState } from 'react';
import { Slider, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--gray-bg)',
  padding: '2rem 1rem',
});

const MainWrapper = styled(Box)({
  display: 'flex',
  gap: '2rem',
  width: '100%',
  maxWidth: '900px',
  alignItems: 'flex-start',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const Card = styled(Paper)({
  width: 'min(90vw, 420px)',
  borderRadius: 'var(--border-radius)',
  boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
  background: '#fff',
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
});

const CompensationCard = styled(Paper)({
  width: 'min(90vw, 380px)',
  borderRadius: 'var(--border-radius)',
  boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
  background: '#fff',
  padding: '2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  height: 'fit-content',
});

const LabelRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 2,
});

const Label = styled(Typography)({
  fontSize: '0.93rem',
  color: 'var(--text-soft)',
  fontWeight: 600,
});

const Value = styled(Typography)({
  fontSize: '1.08rem',
  color: 'var(--green)',
  fontWeight: 700,
  minWidth: 60,
  textAlign: 'right',
});

const CustomSlider = styled(Slider)(({ slidercolor }) => ({
  color: slidercolor,
  height: 4,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: `2px solid ${slidercolor}`,
    boxShadow: `0 2px 8px ${slidercolor}30, 0 1px 3px rgba(0,0,0,0.08)`,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: `0 4px 16px ${slidercolor}40, 0 2px 6px rgba(0,0,0,0.12)`,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.08,
    backgroundColor: '#e5e7eb',
    height: 4,
    borderRadius: 2,
  },
  '& .MuiSlider-track': {
    background: `linear-gradient(90deg, ${slidercolor}60, ${slidercolor})`,
    border: 'none',
    height: 4,
    borderRadius: 2,
    transition: 'all 0.2s ease',
  },
  '& .MuiSlider-mark': {
    backgroundColor: slidercolor,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
    transition: 'opacity 0.2s ease',
    '&.MuiSlider-markActive': {
      opacity: 0.8,
    },
  },
  '&:hover .MuiSlider-track': {
    background: `linear-gradient(90deg, ${slidercolor}70, ${slidercolor})`,
  },
}));

function getSliderColor(val, min, max) {
  const percent = (val - min) / (max - min);
  if (percent > 0.5) {
    // Green when moving right
    return '#30d158';
  } else {
    // Gray when moving left
    return '#9ca3af';
  }
}

export default function App() {
  // Slider 1: Salary
  const salaryMin = 4000;
  const salaryStep = 175;
  const salarySteps = 6;
  const salaryMax = salaryMin + salaryStep * (salarySteps - 1);

  // Slider 2: Equity
  const equityMax = 10;
  const equityMin = 5;
  const equityStep = 1;

  // Slider 3: Exit Buyout %
  const buyoutBase = 10;
  const buyoutStep = 0.2;
  const buyoutSteps = 5;
  const buyoutMax = buyoutBase + buyoutStep * buyoutSteps;

  // Slider 4: Company Profit
  const profitMin = 100000;
  const profitMax = 500000;
  const profitStep = 25000;

  // State: equity is the main driver
  const [equity, setEquity] = useState(equityMax);
  // State: company profit
  const [yearlyProfit, setYearlyProfit] = useState(profitMax);
  // Salary is derived from equity
  const salary = salaryMin + (equityMax - equity) * salaryStep;
  // Buyout is derived from equity
  const buyout = buyoutBase + (equityMax - equity) * buyoutStep;

  // Pavyzdžio duomenys
  const best12 = 20000;
  const last12 = 15000;
  const valuation = (best12 * 6) + (last12 * 6);
  const buyoutAmount = valuation * (buyout / 100);

  // Yearly compensation calculation
  const profitShare = yearlyProfit * (equity / 100);
  const yearlySalary = salary * 12;
  const totalYearlyCompensation = yearlySalary + profitShare;

  // Handlers
  const handleSalaryChange = (_, newValue) => {
    const newEquity = equityMax - Math.round((newValue - salaryMin) / salaryStep);
    setEquity(newEquity);
  };
  const handleEquityChange = (_, newValue) => {
    setEquity(newValue);
  };
  const handleProfitChange = (_, newValue) => {
    setYearlyProfit(newValue);
  };

  return (
    <Container>
      <MainWrapper>
        <Card elevation={0}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.13rem', mb: 1, letterSpacing: 0.2 }}>
            Pasiūlymo simuliatorius
          </Typography>
          <Box>
            <LabelRow>
              <Label>Atlyginimas</Label>
              <Value>{salary.toLocaleString('lt-LT')} €</Value>
            </LabelRow>
            <CustomSlider
              min={salaryMin}
              max={salaryMax}
              step={salaryStep}
              marks
              value={salary}
              onChange={handleSalaryChange}
              slidercolor={getSliderColor(salary, salaryMin, salaryMax)}
              sx={{ width: '100%' }}
            />
          </Box>
          <Box>
            <LabelRow>
              <Label>Pelno dalis</Label>
              <Value>{equity}%</Value>
            </LabelRow>
            <CustomSlider
              min={equityMin}
              max={equityMax}
              step={equityStep}
              marks
              value={equity}
              onChange={handleEquityChange}
              slidercolor={getSliderColor(equity, equityMin, equityMax)}
              sx={{ width: '100%' }}
              valueLabelDisplay="off"
            />
          </Box>
          <Box>
            <LabelRow>
              <Label>Išpirkimo sąlyga išeinant</Label>
              <Value>{buyout.toFixed(1)}%</Value>
            </LabelRow>
            <CustomSlider
              min={buyoutBase}
              max={buyoutMax}
              step={buyoutStep}
              marks
              value={buyout}
              disabled
              slidercolor={getSliderColor(buyout, buyoutBase, buyoutMax)}
              sx={{ width: '100%', opacity: 0.7 }}
            />
            <Typography sx={{ fontSize: '0.80rem', color: 'var(--text-soft)', mt: 1.2, lineHeight: 1.5, fontWeight: 400, textAlign: 'justify' }}>
              Jei Deividas savo noru pasitraukia iš projekto po nustatyto laikotarpio (vesting), įmonė įsipareigoja išpirkti jo dalį pagal šią formulę:<br/>
              <b>Vertinimas:</b> (Geriausių 6 mėn. vidurkis × 6 + Paskutinių 6 mėn. vidurkis × 6)<br/>
              <b>Išmokėjimas:</b> {buyout.toFixed(1)}% nuo šio vertinimo.<br/>
              Visi skaičiavimai atliekami pagal grynąjį pelną (po mokesčių, veiklos ir kitų išlaidų).<br/>
              Išmoka per 30 kalendorinių dienų nuo išėjimo, nebent raštu susitarta kitaip.<br/>
              <b>Jei pasitraukiama per pirmus 6 mėnesius – išmoka netaikoma.</b>
            </Typography>
            <Box sx={{ mt: 1.2, background: 'rgba(48,209,88,0.07)', borderRadius: 2, p: 1.2 }}>
              <Typography sx={{ fontSize: '0.80rem', color: 'var(--text)', fontWeight: 600, mb: 0.2 }}>
                Pavyzdys:
              </Typography>
              <Typography sx={{ fontSize: '0.80rem', color: 'var(--text-soft)' }}>
                Geriausių 6 mėn. vidurkis: <b>20 000 €</b><br/>
                Paskutinių 6 mėn. vidurkis: <b>15 000 €</b><br/>
                Vertinimas: (20 000 × 6) + (15 000 × 6) = <b>{valuation.toLocaleString('lt-LT')} €</b><br/>
                Išmokėjimas: {valuation.toLocaleString('lt-LT')} × {buyout.toFixed(1)}% = <b>{buyoutAmount.toLocaleString('lt-LT', {maximumFractionDigits: 0})} €</b>
              </Typography>
            </Box>
          </Box>
        </Card>
        <CompensationCard elevation={0}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.13rem', mb: 1, letterSpacing: 0.2 }}>
            Metinė kompensacija
          </Typography>
          
          {/* Company Profit Slider */}
          <Box>
            <LabelRow>
              <Label>Projekto pelnas</Label>
              <Value>{yearlyProfit.toLocaleString('lt-LT')} €</Value>
            </LabelRow>
            <CustomSlider
              min={profitMin}
              max={profitMax}
              step={profitStep}
              marks
              value={yearlyProfit}
              onChange={handleProfitChange}
              slidercolor={getSliderColor(yearlyProfit, profitMin, profitMax)}
              sx={{ width: '100%' }}
            />
          </Box>

          {/* Yearly Compensation Info Block */}
          <Box>
            <Box sx={{ background: 'rgba(48,209,88,0.08)', borderRadius: 2, p: 1.5 }}>
              <Typography sx={{ fontSize: '0.82rem', color: 'var(--text-soft)', mb: 1, lineHeight: 1.4 }}>
                Jei projektas nuosekliai generuoja <b>{yearlyProfit.toLocaleString('lt-LT')} €</b> pelno, pelno dalis tampa labai reikšminga bendros kompensacijos dalimi:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.80rem', color: 'var(--text-soft)' }}>
                    Metinis atlyginimas:
                  </Typography>
                  <Typography sx={{ fontSize: '0.80rem', color: 'var(--text)', fontWeight: 600 }}>
                    {yearlySalary.toLocaleString('lt-LT')} €
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.80rem', color: 'var(--text-soft)' }}>
                    Pelno dalis ({equity}%):
                  </Typography>
                  <Typography sx={{ fontSize: '0.80rem', color: 'var(--green)', fontWeight: 600 }}>
                    {profitShare.toLocaleString('lt-LT')} €
                  </Typography>
                </Box>
                <Box sx={{ height: '1px', background: 'rgba(0,0,0,0.08)', my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 700 }}>
                    Bendra metinė suma:
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--green)', fontWeight: 700 }}>
                    {totalYearlyCompensation.toLocaleString('lt-LT')} €
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CompensationCard>
      </MainWrapper>
    </Container>
  );
}
