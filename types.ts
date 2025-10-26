export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Not Interested';

export interface Lead {
  id: number;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  openingHours?: string;
  status: LeadStatus;
  latitude?: number;
  longitude?: number;
}

export interface MapInfo {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  maps: MapInfo;
}

export interface VerificationResult {
  meetsRequirement: boolean;
  justification: string;
  applicationUrl?: string | null;
}