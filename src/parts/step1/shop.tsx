import React, { useMemo } from "react";
import styles from "./index.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUpgrades, buyUpgrade, selectResources, selectSpheres } from "../../app/gameSlice";
import "./shop.scss";
import { UPGRADES } from "../../Upgrades";
import CountUp from "../../components/CountUp";

// Компонент для отрисовки фона с иконками
const UpgradeBackground: React.FC<{ icon: string; level: number }> = ({ icon, level }) => {
  // Создаем массив иконок в количестве, равном уровню апгрейда
  const icons = Array.from({ length: Math.min(level, 100) }, (_, index) => (
    <span key={index} className="upgrade-icon-bg">{icon}</span>
  ));
  
  return <div className="upgrade-background">{icons}</div>;
};

export const Shop = () => {
  const stateUpgrades = useAppSelector(selectUpgrades);
  const resources = useAppSelector(selectResources);
  const spheres = useAppSelector(selectSpheres);
  const dispatch = useAppDispatch();
  
  // Объединяем данные из стейта с полными данными апгрейдов
  const viewUpgrades = useMemo(() => {
    return UPGRADES.map(originalUpgrade => {
      const stateUpgrade = stateUpgrades.find(u => u.id === originalUpgrade.id);
      
      return {
        ...originalUpgrade,
        isVisible: stateUpgrade?.isVisible || false,
        level: stateUpgrade?.level || 0,
        cost: stateUpgrade?.cost || originalUpgrade.cost
      };
    });
  }, [stateUpgrades]);
  
  return (
    <div className={styles.shop}>
      {viewUpgrades
        .filter(upgrade => upgrade.isVisible)
        .map(upgrade => (
          <button 
            key={upgrade.id} 
            onClick={() => dispatch(buyUpgrade(upgrade.id))} 
            className={`upgrade-button ${resources < upgrade.cost ? 'disabled' : ''}`} 
            disabled={resources < upgrade.cost}
          >
            <UpgradeBackground icon={upgrade.icon} level={upgrade.level} />
            <div className="upgrade-content">
              <div className="upgrade-icon-main">{upgrade.icon}</div>
              <div className="upgrade-info">
                <div className="upgrade-name">
                  {upgrade.name}
                  <span className="upgrade-spheres">
                    {upgrade.spheres.map(sphere => spheres[sphere as keyof typeof spheres]?.name).join('')}
                  </span>
                  </div>
                <div className="upgrade-details">
                  <span className="upgrade-level">Уровень: {upgrade.level}</span>
                  <span className="upgrade-cost">
                    Стоимость: <CountUp value={Math.round(upgrade.cost)} suffix="💸" duration={300} />
                  </span>
                  <span className="upgrade-gain">
                    Доход: <CountUp 
                      value={Math.round((upgrade.CPS * Math.pow(upgrade.growthRate, upgrade.level) 
                      + Number.EPSILON) * 100) / 100} 
                      duration={300}
                      decimals={2}
                    />
                    {upgrade.spheres.map(sphere => spheres[sphere as keyof typeof spheres]?.icon).join('')}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
    </div>
  );
};
