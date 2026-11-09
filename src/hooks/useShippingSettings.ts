import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ShippingSettings {
  fee: number;
  threshold: number;
  loading: boolean;
}

export function useShippingSettings(): ShippingSettings {
  const [fee, setFee] = useState(50);
  const [threshold, setThreshold] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [feeResult, thresholdResult] = await Promise.all([
          supabase.from('website_settings').select('value').eq('key', 'shipping_fee').maybeSingle(),
          supabase.from('website_settings').select('value').eq('key', 'shipping_threshold').maybeSingle(),
        ]);

        if (!active) return;
        if (feeResult.data?.value != null) setFee(Number(feeResult.data.value));
        if (thresholdResult.data?.value != null) setThreshold(Number(thresholdResult.data.value));
      } catch {
        // Keep the documented defaults when settings are unavailable.
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { fee, threshold, loading };
}
